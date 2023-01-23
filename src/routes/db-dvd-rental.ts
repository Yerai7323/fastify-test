/* eslint-disable @typescript-eslint/no-floating-promises */
import { FastifyInstance } from 'fastify'
import { connectionORM } from '../../connection-config'
import { Film } from '../entities/dvd-rental/film'
import { Language } from '../entities/dvd-rental/language'

const filmRepository = connectionORM.getRepository(Film)
const languageRepository = connectionORM.getRepository(Language)

export default async (fastify: FastifyInstance): Promise<void> => {
  // Find one Film by ID with Language
  fastify.get<{ Params: { id: number } }>('/:id', async (req, res) => {
    const { id } = req.params
    try {
      const films = await filmRepository.findOne({
        where: { film_id: id },
        relations: ['language']
      })
      res.send(films)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Find all Films with language
  fastify.get('/', async (req, res) => {
    try {
      const films = await filmRepository.find({
        relations: ['language'],
        order: { film_id: 'ASC' }
      })
      res.send(films)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Find all languages with Films
  fastify.get('/language', async (req, res) => {
    try {
      const languages = await languageRepository.find({
        relations: ['films'],
        order: { language_id: 'ASC' }
      })
      res.send(languages)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Find all Films with Category
  fastify.get('/film-category', async (req, res) => {
    try {
      const films = await filmRepository.find({
        select: {
          film_id: true,
          title: true,
          release_year: true,
          categories: { name: true }
        },
        relations: ['categories']
      })
      res.send(films)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Find mix tables
  fastify.get('/mix', async (req, res) => {
    console.time()
    try {
      const films = await filmRepository.find({
        select: {
          film_id: true,
          title: true,
          categories: { name: true },
          language: { name: true },
          actors: { first_name: true, last_name: true }
        },
        relations: ['categories', 'language', 'actors']
      })
      const resp = films.map(film => {
        return {
          film_id: film.film_id,
          title: film.title,
          categories: film.categories.map(categories => {
            return categories.name
          }),
          language: film.language.name,
          actors: film.actors.map(actor => {
            return `${actor.first_name} ${actor.last_name}`
          })
        }
      })
      res.send(resp)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
    console.timeEnd()
  })

  // Add film
  fastify.post<{ Body: { title: string, languageId: number, rentalDuration: number, rentalRate: number, replacementCost: number, fulltext: string } }>('/insert-film', async (req, res) => {
    const { title, languageId, rentalDuration, rentalRate, replacementCost, fulltext } = req.body

    try {
      const film = new Film()
      film.title = title
      film.language_id = +languageId
      film.rental_duration = +rentalDuration
      film.rental_rate = +rentalRate
      film.replacement_cost = +replacementCost
      film.last_update = new Date()
      film.fulltext = fulltext

      const filmInserted = await filmRepository.save(film)
      // const userInserted = await userRepository.findOneBy({ id })
      res.send(filmInserted)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })
}

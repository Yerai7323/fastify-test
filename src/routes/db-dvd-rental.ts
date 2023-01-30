/* eslint-disable @typescript-eslint/no-floating-promises */
import { FastifyInstance } from 'fastify'
import { ILike } from 'typeorm'
import { connectionORM } from '../../connection-config'
import { Film } from '../entities/dvd-rental/film'
import { Language } from '../entities/dvd-rental/language'
import { Rental } from '../entities/dvd-rental/rental'
import { orderByAndType } from '../utils/order-clauses'
import { betweenPaymentId, dates } from '../utils/where-clauses'

const filmRepository = connectionORM.getRepository(Film)
const languageRepository = connectionORM.getRepository(Language)
const rentalRepository = connectionORM.getRepository(Rental)

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

  // first rental: 2005-05-24T20:53:30.000Z
  // last rental: 2006-02-14T14:16:03.000Z
  fastify.get<{
    Querystring: {
      skip: number
      take: number
      fromDate: Date
      toDate: Date
      orderBy: string
      orderType: string
    }
  }>('/dates', async (req, res) => {
    try {
      const {
        take = 5,
        skip = 0,
        fromDate,
        toDate,
        orderBy = 'rental_id',
        orderType = 'asc'
      } = req.query

      const conditions: any = dates(fromDate, toDate)
      const order: any = orderByAndType(orderBy, orderType)
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      // const order = { inventory: { film_id: 'asc' } } as FindOptionsOrder<Rental>

      const rental = await rentalRepository.find({
        select: {
          rental_id: true,
          rental_date: true,
          return_date: true,
          inventory: {
            film_id: true,
            film: {
              title: true,
              release_year: true
            }
          }
        },
        where: conditions,
        take,
        skip,
        order,
        relations: ['inventory', 'inventory.film']
      })
      res.send(rental)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Find mix tables
  fastify.get<{
    Querystring: {
      skip: number
      take: number
      minPaymentId: number
      maxPaymentId: number
      titleContains: string
    }
  }>('/mix', async (req, res) => {
    try {
      let conditions: any = { }
      let { take = 5, skip = 0, minPaymentId, maxPaymentId, titleContains } = req.query

      if (titleContains !== undefined) {
        conditions = {
          title: ILike(`%${titleContains}%`),
          ...conditions
        }
      }

      if (minPaymentId !== undefined || maxPaymentId !== undefined) {
        if (minPaymentId === undefined) minPaymentId = 0
        if (maxPaymentId === undefined) maxPaymentId = 99999

        const between = betweenPaymentId(minPaymentId, maxPaymentId)
        conditions = {
          inventories: between,
          ...conditions
        }
        // conditions.inventories = between
      }

      const films = await filmRepository.find({
        select: {
          film_id: true,
          title: true,
          categories: { name: true },
          language: { name: true },
          actors: {
            first_name: true,
            last_name: true
          },
          inventories: {
            inventory_id: true,
            rental: {
              rental_id: true,
              rental_date: true,
              return_date: true,
              payments: {
                payment_id: true,
                amount: true
              }
            }
          }
        },
        take,
        skip,
        where: [conditions, { film_id: 1 }], /* {
          inventories: {
            rental: {
              payments: { payment_id: Between(minPaymentId, maxPaymentId) }
            }
          }
        }, */
        order: {
          // film_id: 'asc'
          inventories: {
            rental: {
              payments: { payment_id: 'desc' }
            }
          }
        },
        relations: [
          'categories',
          'language',
          'actors',
          'inventories',
          'inventories.rental',
          'inventories.rental.payments'
        ]
      })
      let totalAmount = 0
      let count = 0
      const resp = films.map(film => {
        const inventoriesId: Number[] = []
        const storesId: Number[] = []
        const rentalId: Number[] = []
        const rentalDate: String[] = []
        const amount: Number[] = []
        const paymentId: Number[] = []
        // eslint-disable-next-line array-callback-return
        film.inventories.map(inventory => {
          inventoriesId.push(inventory.inventory_id)
          storesId.push(inventory.store_id)
          rentalId.push(inventory.rental?.rental_id)
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          rentalDate.push(`${inventory.rental?.rental_date.toISOString()} - ${inventory.rental?.return_date?.toISOString()}`)
          // eslint-disable-next-line array-callback-return
          inventory.rental?.payments.map(payment => {
            paymentId.push(payment.payment_id)
            amount.push(payment.amount)
            totalAmount += payment.amount
          })
        })
        return {
          film_id: film.film_id,
          title: film.title,
          categories: film.categories.map(categories => {
            return categories.name
          }),
          language: film.language.name,
          actors: film.actors.map(actor => {
            return `${actor.first_name} ${actor.last_name}`
          }),
          inventories: {
            inventories_id: inventoriesId
          },
          rental: {
            rental_id: rentalId,
            rental_date: rentalDate
          },
          payments: {
            payment_id: paymentId,
            amount
          }
        }
      })
      count = resp.length
      const respFinal = { totalAmount, count, resp }
      res.send(respFinal)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
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

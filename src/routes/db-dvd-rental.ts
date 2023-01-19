/* eslint-disable @typescript-eslint/no-floating-promises */
import { FastifyInstance } from 'fastify'
import { connectionORM } from '../../connection-config'
import { Film } from '../entities/dvd-rental/film'

const filmRepository = connectionORM.getRepository(Film)

export default async (fastify: FastifyInstance): Promise<void> => {
  // Find all
  fastify.get('/', async (req, res) => {
    try {
      const films = await filmRepository.findOne({
        where: { film_id: 1 },
        relations: ['language']
      })
      res.send(films)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  fastify.get('/test', async (req, res) => {
    try {
      const films = await filmRepository.find()
      res.send(films)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })
}

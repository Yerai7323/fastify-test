/* eslint-disable @typescript-eslint/no-floating-promises */
import { FastifyInstance } from 'fastify'
import { Like } from 'typeorm'
import { User } from '../entities/User'

export default async (fastify: FastifyInstance): Promise<void> => {
  // Find all
  fastify.get('/', async (req, res) => {
    try {
      const users = await User.find()
      res.send(users)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Find with pagination
  fastify.post<{ Body: { take: number, skip: number } }>('/pagination', async (req, res) => {
    let { take, skip } = req.body
    if (take === undefined) take = 5
    if (skip === undefined) skip = 0

    try {
      /* console.log('find - count')
    console.time()
    const result2 = await User.find(
      {
        where: {
          firstName: Like('%' + 'a' + '%')
        },
        order: { id: 'ASC' },
        take,
        skip
      })
    const count2 = await User.count({ where: { firstName: Like('%' + 'a' + '%') } })
    console.timeEnd() */

      const [result, count] = await User.findAndCount(
        {
          where: [
            { firstName: Like('%q%') },
            { lastName: Like('%a%') },
            { active: false }
          ],
          order: { id: 'ASC' },
          take,
          skip
        })

      res.send({
        totalCount: count,
        totalPages: Math.ceil(count / take),
        resultCount: result.length,
        hasNextPage: (Number(take) + Number(skip)) < count,
        hasPreviousPage: Number(skip) > 0,
        data: result
      })
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Add user
  fastify.post<{ Body: { firstName: string, lastName: string } }>('/', async (req, res) => {
    const { firstName, lastName } = req.body
    if (firstName === undefined || lastName === undefined) {
      res.status(500).send({ message: 'Incorrect data' })
    }

    try {
      const user = new User()
      user.firstName = firstName
      user.lastName = lastName
      const { id } = await user.save()
      const userInserted = await User.findOneBy({ id })
      res.send(userInserted)
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Update user
  fastify.put<{ Params: { id: number }, Body: { firstName: string, lastName: string, active: boolean } }>('/:id', async (req, res) => {
    const { id } = req.params

    try {
      /* const updated = await User.update({ id }, req.body)
      const user = await User.findOneBy({ id }) */

      // Usando QueryBuilder
      const updated = await User.createQueryBuilder().update(User, req.body).where('id = :id', { id }).returning('*').updateEntity(true).execute()
      if (updated.affected === 0) await res.status(404).send({ message: 'User does not exists' })
      res.send(updated.raw[0])
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })

  // Delete
  fastify.delete<{ Params: { id: number } }>('/:id', async (req, res) => {
    const { id } = req.params

    try {
      const deleted = await User.delete({ id })
      if (deleted.affected === 0) await res.status(404).send({ message: 'User does not exists' })
      res.send({ message: `User ${id} deleted` })
    } catch (error) {
      if (error instanceof Error) {
        res.send({ message: error.message })
      }
    }
  })
}

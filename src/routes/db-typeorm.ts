import { FastifyInstance } from 'fastify'
import { User } from '../entities/User'

export default async (fastify: FastifyInstance): Promise<void> => {
  // Find all
  fastify.get('/', async (req, res) => {
    const users = await User.find()
    return users
  })

  // Add user
  fastify.post<{ Body: { firstName: string, lastName: string } }>('/', async (req, res) => {
    const { firstName, lastName } = req.body
    const user = new User()
    user.firstName = firstName
    user.lastName = lastName

    await user.save()
    console.log(user)
    return { hello: 'world' }
  })

  // Update user
  fastify.put<{ Params: { id: number }, Body: { firstName: string, lastName: string, active: boolean } }>('/:id', async (req, res) => {
    const { id } = req.params
    // const { firstName, lastName, active } = req.body
    const user = await User.findOneBy({ id })

    if (user == null) return await res.status(404).send({ message: 'User does not exists' })

    await User.update({ id }, req.body)
    /* user.firstName = firstName
    user.lastName = lastName
    user.active = active
    await user.save() */

    return await User.findOneBy({ id })
  })

  // Delete
  fastify.delete<{ Params: { id: number } }>('/:id', async (req, res) => {
    const { id } = req.params

    await User.delete({ id })

    return { message: `User ${id} deleted` }
  })
}

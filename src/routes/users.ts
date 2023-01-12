import { FastifyInstance } from 'fastify'

const generateId = (): number => { return Math.floor(Math.random() * 9999999999) }

let users = [
  { id: generateId(), name: 'pepe' },
  { id: generateId(), name: 'juan' },
  { id: generateId(), name: 'antonio' }
]

export default async (fastify: FastifyInstance): Promise<void> => {
  // Find all
  fastify.get('/', async (req, res) => {
    await res.send(users)
  })

  // Find by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (req, res) => {
    const { id } = req.params
    const user = users.find(user => user.id === +id)
    await res.send((user != null) ? user : { error: 'Usuario no encontrado' })
  })

  // Add user
  fastify.post<{ Body: { name: string } }>('/', async (req, res) => {
    const newId = generateId()
    const newUser = { id: newId, name: req.body.name }
    users.push(newUser)
    await res.send(newUser)
  })

  // Update user
  fastify.put<{ Params: { id: string }, Body: { name: string } }>('/:id', async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const user = users.find(user => user.id === +id)
    if (user != null) {
      user.name = name
      await res.send(user)
    } else {
      await res.send({ error: 'Usuario no encontrado' })
    }
  })

  // Delete user
  fastify.delete<{ Params: { id: string } }>('/:id', async (req, res) => {
    const { id } = req.params
    const user = users.find(user => user.id === +id)
    const userDeleted = users.filter(user => user.id !== +id)
    users = userDeleted
    await res.send((user != null) ? user : { error: 'Usuario no encontrado' })
  })
}

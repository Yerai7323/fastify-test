import { FastifyInstance } from 'fastify'
import { SQLStatementORM } from '../utils/sql-queries'

export default async (fastify: FastifyInstance): Promise<void> => {
  // Find all
  fastify.get('/', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(SQLStatementORM.selectAllUserDesc())
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find all actives
  fastify.get('/actives', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(SQLStatementORM.selectAllActiveUserDesc())
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find all deleted
  fastify.get('/deleted', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(SQLStatementORM.selectAllDeletedUserDesc())
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(SQLStatementORM.selectUserById(req.params.id))
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find by Name
  fastify.get<{ Params: { name: string } }>('/name/:name', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(SQLStatementORM.selectUserByName(req.params.name))
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Add user
  fastify.post<{ Body: { name: string } }>('/', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(SQLStatementORM.insertUser(req.body.name))
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Update user
  fastify.put<{ Body: { id: string, name: string } }>('/', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(SQLStatementORM.updateUser(req.body.id, req.body.name))
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Delete user
  fastify.delete<{ Params: { id: string } }>('/:id', async (req, res) => {
    const client = await fastify.pg.connect()
    console.log(req.params.id)
    try {
      const { rows } = await client.query(SQLStatementORM.deleteUser(req.params.id))
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })
}

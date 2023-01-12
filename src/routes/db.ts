import { FastifyInstance } from 'fastify'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class SQLStatementORM {
  public static selectAllUserDesc (): string {
    return 'SELECT * FROM users ORDER BY id DESC'
  }
}

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

  // Find by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query('SELECT * FROM users WHERE id=$1', [req.params.id])
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })
}

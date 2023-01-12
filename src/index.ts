import Fastify from 'fastify'
import userRoute from './routes/users'
import dbRoute from './routes/db'
import postgres from '@fastify/postgres'
import { connectionParams } from '../connection-config'

const fastify = Fastify({ logger: true })
const PORT = 3000

const init = async (): Promise<void> => {
  await fastify.register(userRoute, { prefix: '/users' })

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await fastify.register(postgres, connectionParams)
  await fastify.register(dbRoute, { prefix: '/db' })

  fastify.listen({ port: PORT }, (err, address) => {
    if (err != null) {
      fastify.log.error(err)
      process.exit(1) // kill process
    }
    fastify.log.info(`Server listening on ${address}`)
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init()

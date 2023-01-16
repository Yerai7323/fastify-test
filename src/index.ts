import Fastify from 'fastify'
import 'reflect-metadata'
import userRoute from './routes/users'
import dbPlugin from './routes/db-plugin'
import dbTypeOrm from './routes/db-typeorm'
import postgres from '@fastify/postgres'
import { connectionParams, connectionParamsORM } from '../connection-config'

const fastify = Fastify({ logger: true })
const PORT = 3000

const init = async (): Promise<void> => {
  try {
    await fastify.register(userRoute, { prefix: '/users' })

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // dbPlugin
    await fastify.register(postgres, connectionParams)
    console.log('DATABASE PG Connector connected')
    await fastify.register(dbPlugin, { prefix: '/db' })

    // TypeORM
    await connectionParamsORM.initialize()
    console.log('DATABASE TypeORM connected')
    await fastify.register(dbTypeOrm, { prefix: '/typeorm' })

    fastify.listen({ port: PORT }, (err, address) => {
      if (err != null) {
        fastify.log.error(err)
        process.exit(1) // kill process
      }
      fastify.log.info(`Server listening on ${address}`)
    })
  } catch (error) {
    console.error(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init()

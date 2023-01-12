import Fastify from 'fastify'
import userRoute from './routes/users'

const fastify = Fastify({ logger: true })
const PORT = 3000

const init = async (): Promise<void> => {
  await fastify.register(userRoute, { prefix: '/users' })

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

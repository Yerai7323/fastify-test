import supertest from 'supertest'
import dbDvdRentalRawRoutes from '../../routes/db-dvd-rental-raw'
import Fastify from 'fastify'

describe('Test db-dvd-rental-raw', () => {
  const fastifyInstance = Fastify()
  beforeAll(async () => {
    fastifyInstance.pg = {
      connect: jest.fn().mockImplementation(() => ({
        query: jest.fn().mockImplementation(() => ({ rows: [] })),
        release: jest.fn()
      })
      )
    } as any
    await fastifyInstance.register(dbDvdRentalRawRoutes, { prefix: '/dvd-rental-raw' })
    await fastifyInstance.ready()
  })
  afterAll(async () => {
    jest.clearAllMocks()
    await fastifyInstance.close()
  })

  test('/ route', async () => {
    const res = await supertest(fastifyInstance.server).get('/dvd-rental-raw')

    expect(res.text).toEqual('hello')
  })
  test('/bye route', async () => {
    const res = await supertest(fastifyInstance.server).get('/dvd-rental-raw/bye')

    expect(res.text).toEqual('bye')
  })
  test('/with-language route', async () => {
    const res = await supertest(fastifyInstance.server).get('/dvd-rental-raw/with-language')

    expect(res.body).toHaveLength(0)
  })
})

import { FastifyInstance } from 'fastify'
import { findCustomerDataAndAmountSpend, findFilmsWithCategoryAndLanguage, findTitleTimesRentedAndTotalAmount, findTotalFilmsByActor, findTotalFilmsByCategoryWithListOfNames } from '../utils/queries-dvd-rental-raw'

export default async (fastify: FastifyInstance): Promise<void> => {
  // Find films
  fastify.get('/', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query('SELECT * FROM Film ORDER BY film_id ASC OFFSET 0 LIMIT 5')
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find films with language
  fastify.get('/with-language', async (req, res) => {
    const client = await fastify.pg.connect()
    try {
      const query = `SELECT film_id, title, release_year, language.name, language.last_update FROM Film
       LEFT JOIN language
       ON film.language_id = language.language_id
       ORDER BY film_id ASC 
       OFFSET 0 
       LIMIT 5`
      const { rows } = await client.query(query)
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find films with category and language
  fastify.get<{
    Querystring: {
      offset: number
      limit: number
      orderBy: string
      orderType: string
    }
  }>('/with-category', async (req, res) => {
    const {
      offset = 0,
      limit = 5,
      orderBy = 'film_id',
      orderType = 'ASC'
    } = req.query

    const client = await fastify.pg.connect()
    try {
      const query = findFilmsWithCategoryAndLanguage(offset, limit, orderBy, orderType)
      const { rows } = await client.query(query)
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find total appearances by actors
  fastify.get<{
    Querystring: {
      offset: number
      limit: number
      orderBy: string
      orderType: string
    }
  }>('/count-films-by-actor', async (req, res) => {
    const {
      offset = 0,
      limit = 5,
      orderBy = 'total_appearances',
      orderType = 'ASC'
    } = req.query

    const client = await fastify.pg.connect()
    try {
      const query = findTotalFilmsByActor(offset, limit, orderBy, orderType)

      const { rows } = await client.query(query)
      console.table(rows)
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find films title, count by category
  fastify.get<{
    Querystring: {
      offset: number
      limit: number
      orderBy: string
      orderType: string
    }
  }>('/films-by-category', async (req, res) => {
    const {
      offset = 0,
      limit = 5,
      orderBy = 'category.category_id',
      orderType = 'ASC'
    } = req.query

    const client = await fastify.pg.connect()
    try {
      const query = findTotalFilmsByCategoryWithListOfNames(offset, limit, orderBy, orderType)

      const { rows } = await client.query(query)
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find title, times rented and amount total by film
  fastify.get<{
    Querystring: {
      offset: number
      limit: number
      orderBy: string
      orderType: string
    }
  }>('/title-times-rented-amount', async (req, res) => {
    const {
      offset = 0,
      limit = 5,
      orderBy = 'film.film_id',
      orderType = 'ASC'
    } = req.query

    const client = await fastify.pg.connect()
    try {
      const query = findTitleTimesRentedAndTotalAmount(offset, limit, orderBy, orderType)

      const { rows } = await client.query(query)
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })

  // Find customer data and total spend
  fastify.get<{
    Querystring: {
      offset: number
      limit: number
      orderBy: string
      orderType: string
    }
  }>('/total-spend-by-customer', async (req, res) => {
    const {
      offset = 0,
      limit = 5,
      orderBy = 'payment.customer_id',
      orderType = 'ASC'
    } = req.query

    const client = await fastify.pg.connect()
    try {
      const query = findCustomerDataAndAmountSpend(offset, limit, orderBy, orderType)

      const { rows } = await client.query(query)
      console.table(rows)
      return rows
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })
}

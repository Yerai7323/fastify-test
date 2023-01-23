/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` })

interface IConnectionConfig {
  port: number
  host: string
  user: string
  password: string
  database: string
}
export const connectionParams: IConnectionConfig = {
  port: 5432,
  host: 'localhost',
  user: 'admin',
  password: '1234',
  database: 'testdb'
}

export const connectionORM = new DataSource({
  type: 'postgres',
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  port: Number(process.env.DB_PORT) || 5432,
  host: process.env.DB_HOST ?? 'localhost',
  username: process.env.DB_USERNAME ?? 'admin',
  password: process.env.DB_PASSWORD ?? '1234',
  database: process.env.DB_DATABASE ?? 'testtypeorm',
  entities: [`${process.env.DB_ENTITIES ?? 'src/entities/*.ts'}`],
  logging: true,
  synchronize: false
})

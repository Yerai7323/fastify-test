import { DataSource } from 'typeorm'
import { User } from './src/entities/User'
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
  port: 5432,
  host: 'localhost',
  username: 'admin',
  password: '1234',
  database: 'testtypeorm',
  entities: [User],
  logging: false,
  synchronize: false
})

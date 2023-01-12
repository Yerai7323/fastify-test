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

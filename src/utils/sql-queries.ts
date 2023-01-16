// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SQLStatementORM {
  public static selectAllUserDesc (): string {
    return 'SELECT * FROM users ORDER BY id DESC'
  }

  public static selectAllActiveUserDesc (): string {
    return 'SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id DESC'
  }

  public static selectAllDeletedUserDesc (): string {
    return 'SELECT * FROM users WHERE deleted_at IS NOT NULL ORDER BY id DESC'
  }

  public static selectUserById (id: string): string {
    return `SELECT * FROM users WHERE id=${id}`
  }

  public static selectUserByName (name: string): string {
    return `SELECT * FROM users WHERE name='${name}'`
  }

  public static insertUser (name: string): string {
    return `INSERT INTO users(name) VALUES ('${name}') RETURNING *` // tras insertar devolvemos el registro
  }

  public static updateUser (id: string, name: string): string {
    return `UPDATE users SET name = '${name}' WHERE id=${id} RETURNING *` // tras insertar devolvemos el registro
  }

  public static deleteUser (id: string): string {
    return `DELETE FROM users WHERE id=${id}`
  }
}

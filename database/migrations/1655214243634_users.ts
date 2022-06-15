import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import {uuid} from "uuidv4";

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(uuid())
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('username', 50).notNullable().unique()
      table.boolean('is_active').notNullable()
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }


  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

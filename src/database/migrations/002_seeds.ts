import { Kysely } from 'kysely'
import { Database } from '../types'

const UUID = ['3c46ad7a-0645-4cb6-9cc7-3a7b16130bba', 'daf78e12-4f23-41c5-a124-f41466fad664']

export async function up(db: Kysely<Database>): Promise<void> {
  // insert seeding data for user
  await db
    .insertInto('users')
    .values([
      {
        id: UUID[0],
        name: 'John',
      },
      {
        id: UUID[1],
        name: 'Amy',
      },
    ])
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Migration code
  await db.deleteFrom('users').where('users.id', '=', UUID[0]).executeTakeFirst()
  await db.deleteFrom('users').where('users.id', '=', UUID[1]).executeTakeFirst()
}

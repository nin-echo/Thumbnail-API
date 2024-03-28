import { Kysely } from 'kysely'
import { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  // insert seeding data for user
  await db
    .insertInto('users')
    .values([
      {
        name: 'John',
      },
      {
        name: 'Amy',
      },
    ])
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Migration code
  await db.deleteFrom('users').where('users.name', '=', 'John').executeTakeFirst()
  await db.deleteFrom('users').where('users.name', '=', 'Amy').executeTakeFirst()
}

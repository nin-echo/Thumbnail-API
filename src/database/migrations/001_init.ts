import { Kysely, sql } from 'kysely'
import { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', column => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text', column => column.notNull())
    .execute()

  await db.schema
    .createTable('jobs')
    .addColumn('id', 'uuid', column => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('status', 'text', column => column.notNull())
    .execute()

  await db.schema
    .createTable('user_jobs')
    .addColumn('user_id', 'uuid', column => column.references('users.id').onDelete('cascade').notNull())
    .addColumn('job_id', 'uuid', column => column.references('jobs.id').onDelete('cascade').notNull())
    .execute()

  await db.schema
    .createTable('thumbnails')
    .addColumn('id', 'uuid', column => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('job_id', 'uuid', column => column.references('jobs.id').onDelete('cascade').notNull())
    .addColumn('name', 'text')
    .addColumn('metadata', 'bytea', column => column.notNull())
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('thumbnails').execute()
  await db.schema.dropTable('user_jobs').execute()
  await db.schema.dropTable('jobs').execute()
  await db.schema.dropTable('users').execute()
}

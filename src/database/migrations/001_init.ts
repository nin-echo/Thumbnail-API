import { Kysely } from 'kysely'
import { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', column => column.primaryKey())
    .addColumn('name', 'text', column => column.notNull().unique())
    .execute()

  await db.schema
    .createTable('jobs')
    .addColumn('id', 'serial', column => column.primaryKey())
    .addColumn('status', 'text', column => column.notNull())
    .execute()

  await db.schema
    .createTable('user_jobs')
    .addColumn('user_id', 'integer', column => column.references('users.id').onDelete('cascade').notNull())
    .addColumn('job_id', 'integer', column => column.references('jobs.id').onDelete('cascade').notNull())
    .execute()

  await db.schema
    .createTable('thumbnails')
    .addColumn('id', 'serial', column => column.primaryKey())
    .addColumn('job_id', 'integer', column => column.references('jobs.id').onDelete('cascade').notNull())
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

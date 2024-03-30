import { Kysely, sql } from 'kysely'
import { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('jobs')
    .addColumn('id', 'uuid', column => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('status', 'text', column => column.notNull().defaultTo('processing'))
    .addColumn('created_at', 'timestamp', column => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', column => column.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable('thumbnails')
    .addColumn('id', 'uuid', column => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('job_id', 'uuid', column => column.references('jobs.id').onDelete('cascade').notNull())
    .addColumn('name', 'text')
    .addColumn('metadata', 'bytea', column => column.notNull())
    .addColumn('created_at', 'timestamp', column => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', column => column.notNull().defaultTo(sql`now()`))
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('thumbnails').execute()
  await db.schema.dropTable('jobs').execute()
}

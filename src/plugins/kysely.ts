import fp from 'fastify-plugin'
import { Kysely, PostgresDialect, Migrator, FileMigrationProvider } from 'kysely'
import { Pool } from 'pg'
import { Database } from '../database/types'
import * as path from 'path'
import { promises as fs } from 'fs'

export default fp(
  async (fastify, _opts) => {
    if (!fastify.kysely) {
      const dialect = new PostgresDialect({
        pool: new Pool({
          connectionString: fastify.config.DATABASE_URL,
        }),
      })

      const connection = new Kysely<Database>({
        dialect,
      })

      const migtator = new Migrator({
        db: connection,
        provider: new FileMigrationProvider({
          fs,
          path,
          migrationFolder: path.resolve(__dirname, '..', 'database', 'migrations'),
        }),
      })

      const { error, results } = await migtator.migrateToLatest()

      results?.forEach(it => {
        if (it.status === 'Success') {
          fastify.log.info(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
          fastify.log.error(`failed to execute migration "${it.migrationName}"`)
        }
      })

      if (error) {
        fastify.log.error('Error migrating database!')
        fastify.log.error(error)
        process.exit(1)
      }

      fastify.decorate('kysely', connection)
    }

    fastify.addHook('onClose', async () => {
      if (fastify.kysely) {
        fastify.log.info('Running onClose hook: kysely destroy()')
        await fastify.kysely.destroy()
        fastify.log.info('onClose hook: kysely destroyed is done!')
      }
    })
  },
  {
    name: 'kysely',
  },
)

import fp from 'fastify-plugin'
import { JobStatus } from '../../database/models'

export default fp(
  async (fastify, _opts) => {
    fastify.decorate('jobsDataSource', {
      createJob: async (jobId: string) => {
        try {
          fastify.kysely
            .insertInto('jobs')
            .values({
              id: jobId,
              status: 'processing',
            })
            .returningAll()
            .executeTakeFirstOrThrow()
        } catch (error) {
          fastify.log.error('[kysely] Failed to create job in database: ' + error)
        }
      },
      updateJobStatus: async (jobId: string, status: JobStatus) => {
        try {
          fastify.kysely
            .updateTable('jobs')
            .set('status', status)
            .where('id', '=', jobId)
            .returningAll()
            .executeTakeFirstOrThrow()
        } catch (error) {
          fastify.log.error('[kysely] Failed to update job status in database: ' + error)
        }
      },
      getJob: async (jobId: string) => {
        try {
          const job = await fastify.kysely
            .selectFrom('jobs')
            .selectAll()
            .where('id', '=', jobId)
            .executeTakeFirstOrThrow()

          return job
        } catch (error) {
          fastify.log.error('[keysely] Failed to get job in database: ' + error)
        }
      },
    })
  },
  {
    encapsulate: true,
  },
)

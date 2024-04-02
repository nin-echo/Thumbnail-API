import fp from 'fastify-plugin'
import { JobStatus } from '../../database/models'

export default fp(async (fastify, _opts) => {
  fastify.decorate('jobsDataSource', {
    createJob: async (jobId: string) => {
      return fastify.kysely
        .insertInto('jobs')
        .values({
          id: jobId,
          status: 'processing',
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },
    updateJobStatus: async (jobId: string, status: JobStatus) => {
      return fastify.kysely
        .updateTable('jobs')
        .set({
          status,
          updated_at: new Date(),
        })
        .where('id', '=', jobId)
        .returningAll()
        .executeTakeFirstOrThrow()
    },
    getJob: async (jobId: string) => {
      const job = await fastify.kysely.selectFrom('jobs').selectAll().where('id', '=', jobId).executeTakeFirstOrThrow()

      return job
    },
    getAllJobs: async () => {
      return fastify.kysely.selectFrom('jobs').selectAll().execute()
    },
  })
})

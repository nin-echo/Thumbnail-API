import fp from 'fastify-plugin'
import { exit } from 'process'

export default fp(
  async (fastify, _opts) => {
    fastify.decorate('thumbnailsDataSource', {
      saveThumbnail: async (thumbnail: Buffer) => {
        try {
          const newJob = await fastify.kysely
            .insertInto('jobs')
            .values({
              status: 'processing',
            })
            .returningAll()
            .executeTakeFirst()

          if (!newJob) {
            fastify.log.error('Failed to create a new job')
            exit(1)
          }

          fastify.kysely
            .insertInto('thumbnails')
            .values({
              job_id: newJob.id,
              metadata: thumbnail,
            })
            .execute()
        } catch (error) {
          fastify.log.error('Failed to save thumbnail', error)
        }
      },
      findThumbnailByJobId: async (jobId: string) => {
        const thumbnail = await fastify.kysely
          .selectFrom('thumbnails')
          .selectAll()
          .where('job_id', '=', jobId)
          .executeTakeFirstOrThrow()

        return thumbnail
      },
      findThumbnailByUserId: async (userId: string) => {
        const thumbnail = await fastify.kysely
          .selectFrom('thumbnails')
          .selectAll()
          .leftJoin('user_jobs', 'thumbnails.job_id', 'user_jobs.job_id')
          .where('user_jobs.user_id', '=', userId)
          .executeTakeFirstOrThrow()

        return thumbnail
      },
    })
  },
  {
    encapsulate: true,
  },
)

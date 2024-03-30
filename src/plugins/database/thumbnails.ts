import fp from 'fastify-plugin'

export default fp(async (fastify, _opts) => {
  fastify.decorate('thumbnailsDataSource', {
    saveThumbnail: async (jobId: string, name: string, thumbnail: Buffer) => {
      try {
        fastify.kysely
          .insertInto('thumbnails')
          .values({
            job_id: jobId,
            name,
            metadata: thumbnail,
          })
          .returningAll()
          .executeTakeFirstOrThrow()
      } catch (error) {
        fastify.log.error('[kysely] Failed to save thumbnail into database:' + error)
      }
    },
    findThumbnailByJobId: async (jobId: string) => {
      try {
        const thumbnail = await fastify.kysely
          .selectFrom('thumbnails')
          .selectAll()
          .where('job_id', '=', jobId)
          .executeTakeFirstOrThrow()

        return thumbnail
      } catch (error) {
        fastify.log.error(`[kysely] Failed to find thumbnail by job id ${jobId}:${error}`)
      }
    },
  })
})

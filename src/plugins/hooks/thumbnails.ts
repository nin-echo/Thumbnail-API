import fp from 'fastify-plugin'
import sharp from 'sharp'

export default fp(async (fastify, _opts) => {
  fastify.decorate('thumbnailService', {
    generateThumbnail: async (imagePath: string): Promise<Buffer | undefined> => {
      try {
        return sharp(imagePath)
          .resize(100, 100, {
            fit: 'contain',
          })
          .webp()
          .toBuffer()
      } catch (error) {
        fastify.log.error('[sharp] Failed to generate thumbnail:' + error)
        return undefined
      }
    },
    saveThumbnail: async (jobId: string, name: string, thumbnail: Buffer) => {
      try {
        return fastify.kysely
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

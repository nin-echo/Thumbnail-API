import fp from 'fastify-plugin'
import sharp from 'sharp'

export default fp(async (fastify, _opts) => {
  fastify.decorate('thumbnailService', {
    generateThumbnail: async (imagePath: string): Promise<Buffer | undefined> => {
      return sharp(imagePath)
        .resize(100, 100, {
          fit: 'contain',
        })
        .webp()
        .toBuffer()
    },
    saveThumbnail: async (jobId: string, name: string, thumbnail: Buffer) => {
      return fastify.kysely
        .insertInto('thumbnails')
        .values({
          job_id: jobId,
          name,
          metadata: thumbnail,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },
    findThumbnailByJobId: async (jobId: string) => {
      const thumbnail = await fastify.kysely
        .selectFrom('thumbnails')
        .selectAll()
        .where('job_id', '=', jobId)
        .executeTakeFirstOrThrow()

      return thumbnail
    },
  })
})

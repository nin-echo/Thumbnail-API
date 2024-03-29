import util from 'util'
import sharp from 'sharp'
import fs from 'fs'
import { pipeline } from 'stream'
import { FastifyPluginAsync } from 'fastify'
import { ThumbnailParamsSchemaType, ThumbnailSchema } from './schemas/thumbnail'

const pump = util.promisify(pipeline)

const thumbnails: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get<{ Params: ThumbnailParamsSchemaType }>(
    '/:jobId',
    {
      schema: {
        response: {
          200: ThumbnailSchema,
        },
      },
    },
    async function (request, reply) {
      const thumbnail = await fastify.thumbnailsDataSource.findThumbnailByJobId(request.params.jobId)
      const thumbnailBuffer = thumbnail.metadata
      const thumbnailImage = Buffer.from(thumbnailBuffer)
      reply.status(200).send(thumbnailImage)
    },
  )

  fastify.post('/upload', async function (request, reply) {
    const data = await request.file()
    if (!data) {
      throw fastify.httpErrors.badRequest()
    }

    const fileName = `${Date.now()}-${data.filename}`
    await pump(data.file, fs.createWriteStream(fileName))

    if (data.file.truncated) {
      reply.send(fastify.multipartErrors.FilesLimitError())
    }

    const thumnailImg = await sharp(fileName)
      .resize(100, 100, {
        fit: 'contain',
      })
      .png()
      .toBuffer()

    await fastify.thumbnailsDataSource.saveThumbnail(thumnailImg)

    await reply.send({ success: true })
  })
}

export default thumbnails

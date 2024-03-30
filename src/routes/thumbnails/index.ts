import util from 'util'
import fs from 'fs'
import { pipeline } from 'stream'
import { FastifyPluginAsync } from 'fastify'
import { ThumbnailParamsSchemaType, ThumbnailSchema } from './schemas/thumbnail'
import { UPLOAD_IMAGE_PATH_PREFIX } from './constants'
import { randomUUID } from 'crypto'

const pump = util.promisify(pipeline)

const thumbnails: FastifyPluginAsync = async (fastify, _opts) => {
  /**
   * GET /thumbnails/{jobId}
   *
   * @description Get a thumbnail by job id
   */
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
      const thumbnail = await fastify.thumbnailService.findThumbnailByJobId(request.params.jobId)
      const thumbnailBuffer = thumbnail.metadata
      const thumbnailImage = Buffer.from(thumbnailBuffer)
      reply.status(200).send(thumbnailImage)
    },
  )

  /**
   * POST /thumbnails/upload
   *
   * @description Upload an image and generate a thumbnail
   */
  fastify.post('/upload', async function (request, reply): Promise<void> {
    const data = await request.file()
    if (!data) {
      throw fastify.httpErrors.badRequest()
    }

    if (!fs.existsSync(UPLOAD_IMAGE_PATH_PREFIX)) {
      fs.mkdirSync(UPLOAD_IMAGE_PATH_PREFIX, { recursive: true })
    }

    const fileName = UPLOAD_IMAGE_PATH_PREFIX + `${Date.now()}-${data.filename}`
    await pump(data.file, fs.createWriteStream(fileName))

    if (data.file.truncated) {
      reply.send(fastify.multipartErrors.FilesLimitError())
    }

    fastify.log.info('File saved to local disk storage: ' + fileName)

    const jobId = randomUUID()
    await fastify.jobsDataSource.createJob(jobId)
    await fastify.kafKaService.produceThumbnail(jobId, fileName)

    await reply.send({ jobId })
  })
}

export default thumbnails

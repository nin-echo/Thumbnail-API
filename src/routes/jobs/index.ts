import { FastifyPluginAsync } from 'fastify'
import { JobParamsSchemaType, JobSchema } from './schemas/job'

const jobs: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get<{ Params: JobParamsSchemaType }>(
    '/:jobId',
    {
      schema: {
        response: {
          200: JobSchema,
        },
      },
    },
    async function (request, reply) {
      const job = await fastify.jobsDataSource.getJob(request.params.jobId)
      reply.status(200).send(job)
    },
  )

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: JobSchema,
          },
        },
      },
    },
    async function (_request, reply) {
      const allJobs = await fastify.jobsDataSource.getAllJobs()
      reply.status(200).send(allJobs)
    },
  )
}

export default jobs

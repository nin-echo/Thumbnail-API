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
      const { jobId } = request.params
      try {
        const job = await fastify.jobsDataSource.getJob(jobId)
        reply.status(200).send(job)
      } catch (error) {
        fastify.log.error(`Error getting job ${jobId}: ${error}`)
        reply.status(404).send({ message: `Job not found with id ${jobId}` })
      }
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
      try {
        const allJobs = await fastify.jobsDataSource.getAllJobs()
        reply.status(200).send(allJobs)
      } catch (error) {
        fastify.log.error(`Error getting all jobs: ${error}`)
        reply.status(500).send({ message: 'Error getting all jobs' })
      }
    },
  )
}

export default jobs

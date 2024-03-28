import { FastifyPluginAsync } from 'fastify'
import { UserParamsSchemaType, UserSchema } from './schemas/user'

const users: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get<{ Params: UserParamsSchemaType }>(
    '/:id',
    {
      schema: {
        response: {
          200: UserSchema,
        },
      },
    },
    async function (request, reply) {
      const user = await fastify.usersDataSource.findUser(request.params.id)
      if (!user) {
        throw fastify.httpErrors.notFound()
      }

      reply.status(200).send(user)
    },
  )
}

export default users

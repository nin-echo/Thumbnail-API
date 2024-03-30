import fp from 'fastify-plugin'

export default fp(async (fastify, _opts) => {
  fastify.decorate('usersDataSource', {
    findUser: async (id: string) => {
      const user = await fastify.kysely.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst()
      if (!user) {
        throw fastify.httpErrors.notFound()
      }
      return user
    },
  })
})

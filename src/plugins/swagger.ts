import fp from 'fastify-plugin'
import SwaggerUI from '@fastify/swagger-ui'
import Swagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger'

export default fp<FastifyDynamicSwaggerOptions>(async (fastify, _opts) => {
  await fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'Thumbnail API',
        description: 'API Endpoints for Thumbnail Service',
        version: '0.1.0',
      },
      servers: [
        {
          url: `http://0.0.0.0:${fastify.config.PORT}`,
        },
      ],
      components: {},
    },
  })

  if (fastify.config.NODE_ENV !== 'production') {
    await fastify.register(SwaggerUI, {
      routePrefix: '/docs',
    })
  }
})

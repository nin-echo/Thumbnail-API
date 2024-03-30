import test from 'ava'
import Fastify from 'fastify'
import Sensible from '@fastify/sensible'

test('registers sensible plugin', async t => {
  const fastify = Fastify()

  fastify.register(Sensible)

  await fastify.ready()

  t.truthy(fastify.httpErrors)
})

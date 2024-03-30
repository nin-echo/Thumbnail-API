import test from 'ava'
import Fastify from 'fastify'
import Env from '@fastify/env'
import { EnvSchema } from '../../src/schemas/dotenv'

test('registers dotEnv plugin', async t => {
  const fastify = Fastify()

  await fastify.register(Env, {
    schema: EnvSchema,
    dotenv: true,
  })

  await fastify.ready()

  t.truthy(fastify.config)
  t.is(typeof fastify.config, 'object')
  t.truthy(fastify.config.DATABASE_URL)
  t.is(typeof fastify.config.DATABASE_URL, 'string')
  t.truthy(fastify.config.PORT)
  t.is(typeof fastify.config.PORT, 'number')
  t.truthy(fastify.config.KAFKA_CLIENT_ID)
  t.is(typeof fastify.config.KAFKA_CLIENT_ID, 'string')
  t.truthy(fastify.config.KAFKA_BROKERS)
  t.is(typeof fastify.config.KAFKA_BROKERS, 'string')
  t.truthy(fastify.config.KAFKA_GROUP_ID)
  t.is(typeof fastify.config.KAFKA_GROUP_ID, 'string')
  t.truthy(fastify.config.KAFKA_TOPIC)
  t.is(typeof fastify.config.KAFKA_TOPIC, 'string')
})

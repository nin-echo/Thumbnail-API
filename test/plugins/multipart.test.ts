import test from 'ava'
import Fastify, { FastifyInstance } from 'fastify'
import multipart from '../../src/plugins/multipart'

let app: FastifyInstance

test.before(async () => {
  app = Fastify()
  app.register(multipart)

  await app.ready()
})

test.afterEach.always(async () => {
  await app.close()
})

test('plugin registers multipart support', async t => {
  t.truthy(app.hasRequestDecorator('isMultipart'))
})

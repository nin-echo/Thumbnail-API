import test from 'ava'
import Fastify, { FastifyInstance } from 'fastify'
import kysely from '../../src/plugins/kysely'
import { DB_URL } from '../constants'

let app: FastifyInstance

test.before(async () => {
  app = Fastify()
  await app.register(kysely, {
    connectionString: DB_URL,
  })

  await app.ready()
})

test.after.always(async () => {
  await app.close()
})

test('registers kysely plugin', async t => {
  t.truthy(app.kysely)
  t.is(typeof app.kysely, 'object')
})

test('kysely can be destroyed', async t => {
  await t.notThrowsAsync(async () => {
    await app.kysely.destroy()
  })
})

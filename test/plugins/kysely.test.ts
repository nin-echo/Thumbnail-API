import test from 'ava'
import Fastify, { FastifyInstance } from 'fastify'
import kysely from '../../src/plugins/kysely'

let app: FastifyInstance

test.before(async () => {
  app = Fastify()
  await app.register(kysely, {
    connectionString: 'postgres://postgres:password@localhost:5432/postgres',
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
  t.notThrows(async () => {
    await app.kysely.destroy()
  })
})

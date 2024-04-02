import test from 'ava'
import Fastify, { FastifyInstance } from 'fastify'
import kysely from '../../../src/plugins/kysely'
import { DB_URL } from '../../constants'
import thumbnails from '../../../src/plugins/hooks/thumbnails'
import path from 'path'
import { randomUUID } from 'crypto'
import jobs from '../../../src/plugins/hooks/jobs'

let app: FastifyInstance

const imagePath = path.resolve(__dirname, '../../assets/test.png')

test.before(async () => {
  app = Fastify()
  await Promise.all([
    app.register(kysely, {
      connectionString: DB_URL,
    }),
    app.register(jobs),
    app.register(thumbnails),

    app.ready(),
  ])
})

test.after.always(async () => {
  await Promise.all([app.kysely?.destroy(), app.close()])
})

test('registers thumbnailService plugin', async t => {
  t.truthy(app.thumbnailService)
})

test('generate thumbnail with sharp', async t => {
  const thumbnail = await app.thumbnailService.generateThumbnail(imagePath)
  t.truthy(thumbnail)
  t.is(thumbnail instanceof Buffer, true)
})

test('save thumbnail into database', async t => {
  const thumbnail = await app.thumbnailService.generateThumbnail(imagePath)
  t.truthy(thumbnail)

  await t.notThrowsAsync(async () => {
    const jobId = randomUUID()
    await app.jobsDataSource.createJob(jobId)
    const result = await app.thumbnailService.saveThumbnail(jobId, 'test-thumbnail', thumbnail!)

    t.truthy(result)
    t.is(result.job_id, jobId)
    t.is(result.name, 'test-thumbnail')
    t.is(result.metadata instanceof Buffer, true)
  })
})

test('find thumbnail by job id', async t => {
  const thumbnail = await app.thumbnailService.generateThumbnail(imagePath)
  t.truthy(thumbnail)

  await t.notThrowsAsync(async () => {
    const jobId = randomUUID()
    await app.jobsDataSource.createJob(jobId)
    await app.thumbnailService.saveThumbnail(jobId, 'test-thumbnail', thumbnail!)

    const result = await app.thumbnailService.findThumbnailByJobId(jobId)

    t.truthy(result)
    t.is(result.job_id, jobId)
    t.is(result.name, 'test-thumbnail')
    t.is(result.metadata instanceof Buffer, true)
  })
})

test('find thumbnail by job id with non-existent job id', async t => {
  const jobId = randomUUID()

  await t.throwsAsync(async () => {
    await app.thumbnailService.findThumbnailByJobId(jobId)
  })
})

test('find thumbnail by job id with non-existent thumbnail', async t => {
  const jobId = randomUUID()

  await t.throwsAsync(async () => {
    await app.jobsDataSource.createJob(jobId)
    await app.thumbnailService.findThumbnailByJobId(jobId)
  })
})

import test from 'ava'
import Fastify, { FastifyInstance } from 'fastify'
import jobs from '../../../src/plugins/hooks/jobs'
import kysely from '../../../src/plugins/kysely'
import { DB_URL } from '../../constants'
import { randomUUID } from 'crypto'

let app: FastifyInstance

test.before(async () => {
  app = Fastify()
  await Promise.all([
    app.register(kysely, {
      connectionString: DB_URL,
    }),
    app.register(jobs),

    app.ready(),
  ])
})

test.after.always(async () => {
  await Promise.all([app.kysely?.destroy(), app.close()])
})

test('registers jobsDataSource plugin', async t => {
  t.truthy(app.jobsDataSource)
})

test('create job will return correct job id and default status', async t => {
  const jobId = randomUUID()
  const job = await app.jobsDataSource.createJob(jobId)
  t.truthy(job)
  t.is(job.id, jobId)
  t.is(job.status, 'processing')
})

test('get correct job by job id', async t => {
  const jobId = randomUUID()
  await app.jobsDataSource.createJob(jobId)
  const job = await app.jobsDataSource.getJob(jobId)

  t.truthy(job)
  t.is(job.id, jobId)
  t.is(job.status, 'processing')
})

test('get all jobs will return an array of jobs', async t => {
  const jobIdA = randomUUID()
  const jobIdB = randomUUID()
  Array.of(jobIdA, jobIdB).forEach(async jobId => {
    await app.jobsDataSource.createJob(jobId)
  })
  const jobs: { id: string; status: string }[] = await app.jobsDataSource.getAllJobs()

  t.truthy(jobs)
  t.true(Array.isArray(jobs))
  t.is(jobs.length > 0, true)
})

test('update job status will return correct job status', async t => {
  const jobId = randomUUID()

  await app.jobsDataSource.createJob(jobId)

  const job = await app.jobsDataSource.updateJobStatus(jobId, 'success')

  t.truthy(job)
  t.is(job.id, jobId)
  t.is(job.status, 'success')
})

test('find job by invalid job id will throw error', async t => {
  const jobId = randomUUID()

  await t.throwsAsync(async () => {
    await app.jobsDataSource.getJob(jobId)
  })
})

test('update job status with invalid job id will throw error', async t => {
  const jobId = randomUUID()

  await t.throwsAsync(async () => {
    await app.jobsDataSource.updateJobStatus(jobId, 'success')
  })
})

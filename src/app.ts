import fp from 'fastify-plugin'
import { Kafka } from 'kafkajs'
import sharp from 'sharp'
import { join } from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import Env from '@fastify/env'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import { EnvSchema } from './schemas/dotenv'

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  await fastify.register(Env, {
    schema: EnvSchema,
    dotenv: true,
    // data: opts.configData
  })

  await fastify.register(
    fp((fastify, options, done) => {
      const kafka = new Kafka({
        clientId: fastify.config.KAFKA_CLIENT_ID,
        brokers: [fastify.config.KAFKA_BROKERS],
      })

      // kafka consumer
      const consumer = kafka.consumer({ groupId: fastify.config.KAFKA_GROUP_ID })
      consumer.connect().then(async () => {
        await consumer.subscribe({ topic: fastify.config.KAFKA_TOPIC })
        consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            const jobId = message.key?.toString()
            const imgPath = message.value?.toString()
            if (jobId && imgPath) {
              fastify.log.info(`[Kafka] Received message: [topic: ${topic}] [partion: ${partition}] ${imgPath}`)

              try {
                const generatedThumbnail = await sharp(imgPath)
                  .resize(100, 100, {
                    fit: 'contain',
                  })
                  .webp()
                  .toBuffer()
                await fastify.kysely
                  .insertInto('thumbnails')
                  .values({
                    job_id: jobId,
                    metadata: generatedThumbnail,
                  })
                  .executeTakeFirstOrThrow()
                await fastify.kysely
                  .updateTable('jobs')
                  .set('status', 'success')
                  .where('id', '=', jobId)
                  .returningAll()
                  .executeTakeFirstOrThrow()
                fastify.log.info('[Kafka] Thumbnail generated and saved to database')
              } catch (error) {
                fastify.log.error('[Kafka] Failed to generate thumbnail' + error)
              }
            }
          },
        })
      })

      fastify.decorate('kafka', kafka)
      done()
    }),
  )

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
    dirNameRoutePrefix: false,
    ignorePattern: /.*.no-load\.js/,
    indexPattern: /^no$/i,
  })

  // This loads all plugins defined in routes
  // define routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
    ignorePattern: /.*\.js/,
    autoHooksPattern: /.*hooks(\.js|\.cjs|\.ts)$/i,
    autoHooks: true,
    cascadeHooks: true,
  })

  // extra custom logic
  if (fastify.config.NODE_ENV === 'development') {
    fastify.log.info('CURRENT ROUTES:')
    fastify.log.info(fastify.printRoutes())
  }

  fastify.addHook('onClose', async () => {
    fastify.log.info('Closing Fastify server')
    fastify.kysely?.destroy()
    fastify.kafka?.producer()?.disconnect()
    fastify.kafka?.consumer({ groupId: fastify.config.KAFKA_GROUP_ID })?.disconnect()
    fastify.log.info('Fastify server closed')
  })
}

export default app
export { app, options }

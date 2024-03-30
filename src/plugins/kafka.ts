import fp from 'fastify-plugin'
import fs from 'fs'
import { Kafka } from 'kafkajs'
import sharp from 'sharp'

interface KafkaPluginOptions {
  clientId: string
  brokers: string
  topic: string
  groupId: string
}

export default fp<KafkaPluginOptions>((fastify, opts, done) => {
  const { clientId, brokers, topic, groupId } = opts

  const kafka = new Kafka({
    clientId: clientId || fastify.config.KAFKA_CLIENT_ID,
    brokers: [brokers || fastify.config.KAFKA_BROKERS],
  })

  // kafka consumer
  const consumer = kafka.consumer({ groupId: groupId || fastify.config.KAFKA_GROUP_ID })
  consumer.connect().then(async () => {
    await consumer.subscribe({ topic: topic || fastify.config.KAFKA_TOPIC })
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

            const fileName = imgPath.split('/').pop()
            await fastify.thumbnailsDataSource.saveThumbnail(
              jobId,
              fileName || `thumbnail-${jobId}`,
              generatedThumbnail,
            )
            await fastify.jobsDataSource.updateJobStatus(jobId, 'success')

            fs.unlink(imgPath, _ => {})

            fastify.log.info('[Kafka] Thumbnail generated and saved to database')
          } catch (error) {
            fastify.log.error('[Kafka] Failed to generate thumbnail' + error)
          }
        }
      },
    })
  })

  fastify.decorate('kafKaService', {
    instance: kafka,
    produceThumbnail: async (jobId: string, imgPath: string) => {
      const producer = kafka.producer()
      await producer.connect()
      await producer.send({
        topic: topic || fastify.config.KAFKA_TOPIC,
        messages: [{ key: jobId, value: imgPath }],
      })
      await producer.disconnect()
    },
  })

  done()
})

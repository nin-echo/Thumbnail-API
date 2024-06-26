import Fastify from 'fastify'
import App from './app'
import { PinoLoggerOptions } from 'fastify/types/logger'

async function start(): Promise<void> {
  const envToLogger: Record<string, PinoLoggerOptions | boolean> = {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    test: false,
  }

  const fastify = Fastify({
    logger: envToLogger[process.env.NODE_ENV || 'development'] || true,
  })

  await fastify.register(App)

  await fastify.listen({
    host: process.env.HOST || '::',
    port: Number(process.env.PORT) || 8080,
  })
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})

import { type Static, Type } from '@sinclair/typebox'

export const EnvSchema = Type.Object({
  NODE_ENV: Type.String({ default: 'development' }),
  DATABASE_URL: Type.String(),
  PORT: Type.Number({ default: 8080 }),
  KAFKA_CLIENT_ID: Type.String({ default: 'thumbnail' }),
  KAFKA_BROKERS: Type.String({ default: 'localhost:9092' }),
  KAFKA_GROUP_ID: Type.String({ default: 'thumbnail-group' }),
  KAFKA_TOPIC: Type.String({ default: 'thumbnail-jobs' }),
})

export type EnvSchemaType = Static<typeof EnvSchema>

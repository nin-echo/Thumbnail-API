import { type Static, Type } from '@sinclair/typebox'

export const EnvSchema = Type.Object({
  NODE_ENV: Type.String({ default: 'development' }),
  DATABASE_URL: Type.String(),
  PORT: Type.Number({ default: 8080 }),
})

export type EnvSchemaType = Static<typeof EnvSchema>

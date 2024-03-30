import { Type, type Static } from '@sinclair/typebox'

export const JobParamsSchema = Type.Object({
  jobId: Type.String(),
})

export type JobParamsSchemaType = Static<typeof JobParamsSchema>

export const JobSchema = Type.Object({
  id: Type.String(),
  status: Type.String(),
  created_at: Type.String(),
  updated_at: Type.String(),
})

export type JobSchemaType = Static<typeof JobSchema>

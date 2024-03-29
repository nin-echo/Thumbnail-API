import { Type, type Static } from '@sinclair/typebox'

export const ThumbnailParamsSchema = Type.Object({
  jobId: Type.String(),
})

export type ThumbnailParamsSchemaType = Static<typeof ThumbnailParamsSchema>

export const ThumbnailSchema = Type.Unsafe<Buffer>()

export type ThumbnailSchemaType = Static<typeof ThumbnailSchema>

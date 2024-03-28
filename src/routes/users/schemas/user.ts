import { Type, type Static } from '@sinclair/typebox'

export const UserParamsSchema = Type.Object({
  id: Type.String(),
})

export type UserParamsSchemaType = Static<typeof UserParamsSchema>

export const UserSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
})

export type UserSchemaType = Static<typeof UserSchema>

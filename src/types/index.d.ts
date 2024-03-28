import {
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from 'fastify'

import { EnvSchemaType } from '../schemas/dotenv'
import { Kysely } from 'kysely'
import { Database } from '../database/types'

declare module 'fastify' {
  type UserDataSource = {
    findUser: (id: string) => Promise<QueryResult<any>>
  }

  type UserJobDataSource = {
    findJobsByUserId: (userId: string) => Promise<QueryResult<any>>
  }

  type ThumbnailDataSource = {
    findThumbnailByJobId: (jobId: string) => Promise<QueryResult<any>>
    findThumbnailByUserId: (userId: string) => Promise<QueryResult<any>>
  }

  export interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    Logger = FastifyBaseLogger,
  > {
    kysely: Kysely<Database>
    config: EnvSchemaType
    usersDataSource: UserDataSource
    userJobsDataSource: UserJobDataSource
    thumbnailsDataSource: ThumbnailDataSource
  }
}

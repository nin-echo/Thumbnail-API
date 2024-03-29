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
import { JobStatus } from '../database/models'

declare module 'fastify' {
  type UsersDataSource = {
    findUser: (id: string) => Promise<QueryResult<any>>
  }

  type UserJobsDataSource = {
    linkJobToUser: (userId: string, jobId: string) => Promise<QueryResult<any>>
    findJobsByUserId: (userId: string) => Promise<QueryResult<any>>
  }

  type JobsDataSource = {
    createJob: (jobId: string) => Promise<QueryResult<any>>
    updateJobStatus: (jobId: string, status: JobStatus) => Promise<QueryResult<any>>
    getJob: (jobId: string) => Promise<QueryResult<any>>
  }

  type ThumbnailsDataSource = {
    saveThumbnail: (thumbnail: Buffer) => Promise<QueryResult<any>>
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
    usersDataSource: UsersDataSource
    userJobDataSource: UserJobsDataSource
    jobsDataSource: JobsDataSource
    thumbnailsDataSource: ThumbnailsDataSource
  }
}

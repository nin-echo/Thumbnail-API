import {
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from 'fastify'
import { Kafka } from 'kafkajs'

import { EnvSchemaType } from '../schemas/dotenv'
import { Kysely } from 'kysely'
import { Database } from '../database/types'
import { JobStatus } from '../database/models'

/**
 * @description Extends the FastifyInstance interface to include the data sources
 */
declare module 'fastify' {
  type KafKaService = {
    instance: Kafka
    produceThumbnail: (jobId: string, imgPath: string) => Promise<void>
  }

  type JobsDataSource = {
    createJob: (jobId: string) => Promise<QueryResult<any>>
    updateJobStatus: (jobId: string, status: JobStatus) => Promise<QueryResult<any>>
    getJob: (jobId: string) => Promise<QueryResult<any>>
  }

  type ThumbnailsDataSource = {
    saveThumbnail: (jobId: string, name: string, thumbnail: Buffer) => Promise<QueryResult<any>>
    findThumbnailByJobId: (jobId: string) => Promise<QueryResult<any>>
  }

  export interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    Logger = FastifyBaseLogger,
  > {
    kysely: Kysely<Database>
    kafKaService: KafKaService
    config: EnvSchemaType
    jobsDataSource: JobsDataSource
    thumbnailsDataSource: ThumbnailsDataSource
  }
}

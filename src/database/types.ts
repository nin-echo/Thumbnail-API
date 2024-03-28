import { JobTable, ThumbnailTable, UserJobsTable, UserTable } from './models'

export interface Database {
  users: UserTable
  user_jobs: UserJobsTable
  jobs: JobTable
  thumbnails: ThumbnailTable
}

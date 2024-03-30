import { JobTable, ThumbnailTable } from './models'

export interface Database {
  jobs: JobTable
  thumbnails: ThumbnailTable
}

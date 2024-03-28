import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

enum JobStatus {
  processing = 'processing',
  success = 'success',
  failed = 'failed',
}

export interface JobTable {
  id: Generated<string>
  status: ColumnType<JobStatus>
}

type Job = Selectable<JobTable>
type NewJob = Insertable<JobTable>
type UpdatedJob = Updateable<JobTable>
export type { Job, NewJob, UpdatedJob }

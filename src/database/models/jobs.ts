import { Generated, Insertable, Selectable, Updateable } from 'kysely'

type JobStatus = 'processing' | 'success' | 'failed'

export interface JobTable {
  id: Generated<string>
  status: Generated<JobStatus>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

type Job = Selectable<JobTable>
type NewJob = Insertable<JobTable>
type UpdatedJob = Updateable<JobTable>
export type { JobStatus, Job, NewJob, UpdatedJob }

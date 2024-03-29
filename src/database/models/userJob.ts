import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface UserJobsTable {
  user_id: ColumnType<string>
  job_id: ColumnType<string>
}

type UserJob = Selectable<UserJobsTable>
type NewUserJob = Insertable<UserJobsTable>
type UpdatedUserJob = Updateable<UserJobsTable>
export type { UserJob, NewUserJob, UpdatedUserJob }

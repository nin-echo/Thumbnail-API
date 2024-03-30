import { ColumnType, Insertable, Selectable, Updateable, Generated } from 'kysely'

export interface UserJobsTable {
  user_id: ColumnType<string>
  job_id: ColumnType<string>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

type UserJob = Selectable<UserJobsTable>
type NewUserJob = Insertable<UserJobsTable>
type UpdatedUserJob = Updateable<UserJobsTable>
export type { UserJob, NewUserJob, UpdatedUserJob }

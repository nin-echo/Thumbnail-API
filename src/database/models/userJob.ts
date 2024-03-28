import { ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export interface UserJobsTable {
  userId: ColumnType<string>
  jobId: ColumnType<string>
}

type UserJob = Selectable<UserJobsTable>
type NewUserJob = Insertable<UserJobsTable>
type UpdatedUserJob = Updateable<UserJobsTable>
export type { UserJob, NewUserJob, UpdatedUserJob }

import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface UserTable {
  id: Generated<string>
  name: ColumnType<string>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

type User = Selectable<UserTable>
type NewUser = Insertable<UserTable>
type UpdatedUser = Updateable<UserTable>
export type { User, NewUser, UpdatedUser }

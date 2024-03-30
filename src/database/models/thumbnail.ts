import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface ThumbnailTable {
  id: Generated<string>
  job_id: ColumnType<string>
  name: ColumnType<string | null>
  metadata: ColumnType<Buffer>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

type Thumbnail = Selectable<ThumbnailTable>
type NewThumbnail = Insertable<ThumbnailTable>
type UpdatedThumbnail = Updateable<ThumbnailTable>
export type { Thumbnail, NewThumbnail, UpdatedThumbnail }

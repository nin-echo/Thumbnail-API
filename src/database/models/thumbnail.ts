import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'

export interface ThumbnailTable {
  id: Generated<string>
  userId: ColumnType<string>
  jobId: ColumnType<string>
  metadata: JSONColumnType<{
    name: string | null
    data: string
  }>
}

type Thumbnail = Selectable<ThumbnailTable>
type NewThumbnail = Insertable<ThumbnailTable>
type UpdatedThumbnail = Updateable<ThumbnailTable>
export type { Thumbnail, NewThumbnail, UpdatedThumbnail }

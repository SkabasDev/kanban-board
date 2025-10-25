import type { Column } from './column'

export type Board = {
  id: string
  name: string
  columns: Column[]
}

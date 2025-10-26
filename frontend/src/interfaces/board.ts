import type { Column } from './column'

export type Board = {
  id: number
  name: string
  columns: Column[]
}

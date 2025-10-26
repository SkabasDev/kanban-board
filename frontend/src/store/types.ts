import { Column } from "../interfaces/column"

export type BoardState = {
  columns: Column[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

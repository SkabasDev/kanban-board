import { Column } from "../models/column"

export type BoardState = {
  columns: Column[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
  success?: string
}

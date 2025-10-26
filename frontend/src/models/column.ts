import type { Task } from './task'

export type Column = {
  id: number
  name: string
  tasks: Task[]
}

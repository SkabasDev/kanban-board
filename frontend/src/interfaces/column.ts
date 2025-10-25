import type { Task } from './task'

export type Column = {
  id: string
  name: string
  tasks: Task[]
}

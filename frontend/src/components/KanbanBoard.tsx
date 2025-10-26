import { Column as ColumnType } from '../interfaces/column'
import Column from './Column'
import { } from '@dnd-kit/core'

export default function KanbanBoard({ columns, onAddTask, onMoveTask, onUpdateTask, onArchiveTask }: {
  columns: ColumnType[]
  onAddTask: (columnId: number, title: string, description?: string) => void
  onMoveTask: (taskId: number, toColumnId: number, position?: number) => void
  onUpdateTask?: (taskId: number, data: { title?: string; description?: string }) => void
  onArchiveTask?: (taskId: number) => void
}) {
  return (
    <div className="kanban-board">
      {columns.map(col => (
        <Column
          key={col.id}
          column={col}
          allColumns={columns}
          onAddTask={onAddTask}
          onMoveTask={onMoveTask}
          onUpdateTask={onUpdateTask}
          onArchiveTask={onArchiveTask}
        />
      ))}
    </div>
  )
}


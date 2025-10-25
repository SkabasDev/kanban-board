import { Column as ColumnType } from '../types'
import Column from './Column'

export default function KanbanBoard({ columns, onAddTask, onMoveTask }: {
  columns: ColumnType[]
  onAddTask: (columnId: string, title: string) => void
  onMoveTask: (taskId: string, toColumnId: string, position?: number) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {columns.map(col => (
        <Column
          key={col.id}
          column={col}
          allColumns={columns}
          onAddTask={onAddTask}
          onMoveTask={onMoveTask}
        />
      ))}
    </div>
  )
}

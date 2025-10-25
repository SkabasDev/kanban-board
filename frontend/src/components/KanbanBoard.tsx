import { Column as ColumnType } from '../interfaces/column'
import Column from './Column'
import { DndContext, DragEndEvent } from '@dnd-kit/core'

export default function KanbanBoard({ columns, onAddTask, onMoveTask }: {
  columns: ColumnType[]
  onAddTask: (columnId: string, title: string, description?: string) => void
  onMoveTask: (taskId: string, toColumnId: string, position?: number) => void
}) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const taskId = String(active.id)
    const toColumnId = String(over.id)
    onMoveTask(taskId, toColumnId)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
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
    </DndContext>
  )
}

import { Column as ColumnType } from '../interfaces/column'
import Column from './Column'
import { DndContext, DragEndEvent } from '@dnd-kit/core'

export default function KanbanBoard({ columns, onAddTask, onMoveTask, onUpdateTask }: {
  columns: ColumnType[]
  onAddTask: (columnId: number, title: string, description?: string) => void
  onMoveTask: (taskId: number, toColumnId: number, position?: number) => void
  onUpdateTask?: (taskId: number, data: { title?: string; description?: string }) => void
}) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const taskId = Number(active.id)
    const toColumnId = Number(over.id)
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
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
    </DndContext>
  )
}

import { Column } from '../interfaces/column'
import { Task } from '../interfaces/task'
import { useDraggable } from '@dnd-kit/core'

export default function TaskCard({ task, columns, onMove }: { task: Task; columns: Column[]; onMove: (toColumnId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: 0.85,
  } : undefined

  return (
    <div ref={setNodeRef} className={`task-card${isDragging ? ' task-card--dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="task-card__title" style={{ fontWeight: 600 }}>{task.title}</div>
    </div>
  )
}

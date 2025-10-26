import { Grip } from 'lucide-react';
import { Column } from '../interfaces/column'
import { Task } from '../interfaces/task'
import { useDraggable } from '@dnd-kit/core'

export default function TaskCard({ task, columns, onMove, onOpen }: { task: Task; columns: Column[]; onMove: (toColumnId: number) => void; onOpen?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(task.id) })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: 0.85 } : undefined

  return (
    <div ref={setNodeRef} className={`task-card${isDragging ? ' task-card--dragging' : ''}`} onClick={() => { if (!isDragging) onOpen?.() }} style={style} {...attributes}>
      <div className="task-card__title" style={{ fontWeight: 600 }}>{task.title}</div>
      <span className="task-card__handle" title="Arrastrar" role="button" tabIndex={0} {...listeners}><Grip size={10} /></span>
    </div>
  )
}

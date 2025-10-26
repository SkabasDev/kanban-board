import { Grip, Trash2 } from 'lucide-react';
import { Task } from '../models/task'
import { useDraggable } from '@dnd-kit/core'

export default function TaskCard({ task, onOpen, onDelete }: { task: Task; onOpen?: () => void; onDelete?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(task.id) })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: 0.85 } : undefined

  return (
    <div ref={setNodeRef} className={`task-card${isDragging ? ' task-card--dragging' : ''}`} onClick={() => { if (!isDragging) onOpen?.() }} style={style} {...attributes}>
      <div className="task-card__title">{task.title}</div>
      <button className="task-card__handle" aria-label="Arrastrar" type="button" {...listeners} onClick={(e) => e.stopPropagation()}>
        <Grip size={12} />
      </button>
      <button aria-label="Eliminar" type="button" onClick={(e) => { e.stopPropagation(); onDelete?.() }} className="task-card__delete">
        <Trash2 size={12} />
      </button>
    </div>
  )
}

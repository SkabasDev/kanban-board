import { Grip, Trash2 } from 'lucide-react';
import { Task } from '../interfaces/task'
import { useDraggable } from '@dnd-kit/core'

export default function TaskCard({ task, onMove, onOpen, onDelete }: { task: Task; onMove: (toColumnId: number) => void; onOpen?: () => void; onDelete?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(task.id) })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: 0.85 } : undefined

  return (
    <div ref={setNodeRef} className={`task-card${isDragging ? ' task-card--dragging' : ''}`} onClick={() => { if (!isDragging) onOpen?.() }} style={style} {...attributes}>
      <div className="task-card__title">{task.title}</div>
      <span className="task-card__handle" title="Arrastrar" role="button" tabIndex={0} {...listeners}><Grip size={12} /></span>
      <span title="Eliminar" role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onDelete?.() }} style={{ marginLeft: 8, cursor: 'pointer', display: 'inline-flex' }}>
        <Trash2 size={12} />
      </span>
    </div>
  )
}

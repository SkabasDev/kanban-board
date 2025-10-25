import { useState } from 'react'
import { Column as ColumnType } from '../interfaces/column'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'

export default function Column({ column, allColumns, onAddTask, onMoveTask }: {
  column: ColumnType
  allColumns: ColumnType[]
  onAddTask: (columnId: string, title: string) => void
  onMoveTask: (taskId: string, toColumnId: string, position?: number) => void
}) {
  const [title, setTitle] = useState('')
  const nameMap: Record<string, string> = {
    'ToDo': 'Pendiente',
    'Doing': 'En Progreso',
    'Done': 'Completada',
  }
  const displayName = nameMap[column.name] ?? column.name
  const { isOver, setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className={`kanban-column${isOver ? ' kanban-column--over' : ''}`}>
      <h3 className="kanban-column__title">{displayName}</h3>
      <div className="kanban-column__new">
        <input className="kanban-column__input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nueva tarea" />
        <button className="kanban-column__add" onClick={() => { if (title.trim()) { onAddTask(column.id, title.trim()); setTitle('') }}}>Añadir</button>
      </div>
      <div ref={setNodeRef} className="kanban-column__list">
        {column.tasks.map(t => (
          <TaskCard key={t.id} task={t} columns={allColumns} onMove={(to) => onMoveTask(t.id, to)} />
        ))}
      </div>
    </div>
  )
}

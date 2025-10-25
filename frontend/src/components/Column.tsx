import { useState } from 'react'
import { Column as ColumnType } from '../types'
import TaskCard from './TaskCard'

export default function Column({ column, allColumns, onAddTask, onMoveTask }: {
  column: ColumnType
  allColumns: ColumnType[]
  onAddTask: (columnId: string, title: string) => void
  onMoveTask: (taskId: string, toColumnId: string, position?: number) => void
}) {
  const [title, setTitle] = useState('')

  return (
    <div style={{ width: 280, background: '#f8f8f8', borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>{column.name}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {column.tasks.map(t => (
          <TaskCard key={t.id} task={t} columns={allColumns} onMove={(to) => onMoveTask(t.id, to)} />
        ))}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nueva tarea" />
        <button onClick={() => { if (title.trim()) { onAddTask(column.id, title.trim()); setTitle('') }}}>Añadir</button>
      </div>
    </div>
  )
}

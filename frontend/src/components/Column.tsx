import { useState } from 'react'
import { Column as ColumnType } from '../interfaces/column'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import Modal from './Modal'

export default function Column({ column, allColumns, onAddTask, onMoveTask, onUpdateTask }: {
  column: ColumnType
  allColumns: ColumnType[]
  onAddTask: (columnId: number, title: string, description?: string) => void
  onMoveTask: (taskId: number, toColumnId: number, position?: number) => void
  onUpdateTask?: (taskId: number, data: { title?: string; description?: string }) => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const nameMap: Record<string, string> = {
    'ToDo': 'Pendiente',
    'Doing': 'En Progreso',
    'Done': 'Completada',
  }
  const displayName = nameMap[column.name] ?? column.name
  const { isOver, setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className={`kanban-column${isOver ? ' kanban-column--over' : ''}`}>
      <div className="kanban-column__header">
        <h3 className="kanban-column__header__title">{displayName}</h3>
        <button className="kanban-column__header__add" onClick={() => setShowModal(true)}>Añadir</button>
      </div>
      <div ref={setNodeRef} className="kanban-column__list">
        {column.tasks.map(t => (
          <TaskCard
            key={t.id}
            task={t}
            columns={allColumns}
            onMove={(to) => onMoveTask(t.id, to)}
            onOpen={() => {
              setEditingTaskId(t.id)
              setNewTitle(t.title)
              setNewDesc(t.description ?? '')
              setShowModal(true)
            }}
          />
        ))}
      </div>

      <Modal
        open={showModal}
        title={editingTaskId ? 'Estas editando esta vacante' : '¿Quieres crear una nueva tarea?'}
        onClose={() => { setShowModal(false); setEditingTaskId(null); }}
      >
        <div className="modal__body">
          <label className="modal__label">Nombre de la tarea</label>
          <input
            className="modal__input"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Ej. Diseñar pantalla de login"
          />
          <label className="modal__label">Descripción</label>
          <textarea
            className="modal__textarea"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Detalles opcionales de la tarea"
            rows={4}
          />
          <div className="modal__actions">
            <button
              className="modal__btn modal__btn--primary"
              onClick={() => {
                if (!newTitle.trim()) return
                if (editingTaskId) {
                  onUpdateTask?.(editingTaskId, { title: newTitle.trim(), description: newDesc.trim() || undefined })
                  setShowModal(false)
                  setEditingTaskId(null)
                } else {
                  onAddTask(column.id, newTitle.trim(), newDesc.trim() || undefined)
                  setNewTitle('')
                  setNewDesc('')
                  setShowModal(false)
                }
              }}
            >
              Guardar
            </button>
            <button className="modal__btn" onClick={() => { setShowModal(false) }}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


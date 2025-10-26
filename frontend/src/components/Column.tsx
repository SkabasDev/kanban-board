import { useState } from 'react'
import { Column as ColumnType } from '../models/column'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import Modal from './Modal'

const NAME_MAP: Record<string, string> = {
  'ToDo': 'Pendiente',
  'Doing': 'En Progreso',
  'Done': 'Completada',
}

export default function Column({ column, onAddTask, onMoveTask, onUpdateTask, onArchiveTask }: {
  column: ColumnType
  onAddTask: (columnId: number, title: string, description?: string) => void
  onMoveTask: (taskId: number, toColumnId: number) => void
  onUpdateTask?: (taskId: number, data: { title?: string; description?: string }) => void
  onArchiveTask?: (taskId: number) => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const displayName = NAME_MAP[column.name] ?? column.name
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
            onDelete={() => {
              setEditingTaskId(t.id)
              setNewTitle(t.title)
              setNewDesc(t.description ?? '')
              setDeleteMode(true)
              setShowModal(true)
            }}
            onOpen={() => {
              setEditingTaskId(t.id)
              setNewTitle(t.title)
              setNewDesc(t.description ?? '')
              setDeleteMode(false)
              setShowModal(true)
            }}
          />
        ))}
      </div>

      <Modal
        open={showModal}
        title={deleteMode ? 'Seguro que quieres eliminar esta tarea?' : (editingTaskId ? 'Estas editando esta vacante' : '¿Quieres crear una nueva tarea?')}
        onClose={() => { setShowModal(false); setEditingTaskId(null); setDeleteMode(false); }}
      >
        <div className="modal__body">
          <label className="modal__label">Nombre de la tarea</label>
          <input
            className="modal__input"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            disabled={deleteMode}
            placeholder="Ej. Diseñar pantalla de login"
          />
          <label className="modal__label">Descripción</label>
          <textarea
            className="modal__textarea"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            disabled={deleteMode}
            placeholder="Detalles opcionales de la tarea"
            rows={4}
          />
          <div className="modal__actions">
            <button
              className={`modal__btn ${deleteMode ? 'modal__btn--danger' : 'modal__btn--primary'}`}
              onClick={() => {
                if (deleteMode) {
                  if (editingTaskId) onArchiveTask?.(editingTaskId)
                  setShowModal(false)
                  setEditingTaskId(null)
                  setDeleteMode(false)
                  return
                }
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
              {deleteMode ? 'Eliminar' : 'Guardar'}
            </button>
            <button className="modal__btn" onClick={() => { setShowModal(false) }}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


import { useState } from 'react'
import { Column as ColumnType } from '../models/column'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import Modal from './Modal'
import { useTaskModal } from '../hooks/useTaskModal'

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
  const {
    show,
    setShow,
    title,
    setTitle,
    desc,
    setDesc,
    deleteMode,
    openForCreate,
    openForEdit,
    openForDelete,
    confirm,
  } = useTaskModal(onAddTask, onUpdateTask, onArchiveTask, column.id)
  const displayName = NAME_MAP[column.name] ?? column.name
  const { isOver, setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className={`kanban-column${isOver ? ' kanban-column--over' : ''}`}>
      <div className="kanban-column__header">
        <h3 className="kanban-column__header__title">{displayName}</h3>
        <button className="kanban-column__header__add" onClick={() => openForCreate()}>Añadir</button>
      </div>
      <div ref={setNodeRef} className="kanban-column__list">
        {column.tasks.map(t => (
          <TaskCard
            key={t.id}
            task={t}
            onDelete={() => openForDelete(t)}
            onOpen={() => openForEdit(t)}
          />
        ))}
      </div>

      <Modal
        open={show}
        title={deleteMode ? 'Seguro que quieres eliminar esta tarea?' : ('Estas editando esta tarea')}
        onClose={() => { setShow(false); }}
      >
        <div className="modal__body">
          <label className="modal__label">Nombre de la tarea</label>
          <input
            className="modal__input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={deleteMode}
            placeholder="Ej. Diseñar pantalla de login"
          />
          <label className="modal__label">Descripción</label>
          <textarea
            className="modal__textarea"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            disabled={deleteMode}
            placeholder="Detalles opcionales de la tarea"
            rows={4}
          />
          <div className="modal__actions">
            <button
              className={`modal__btn ${deleteMode ? 'modal__btn--danger' : 'modal__btn--primary'}`}
              onClick={() => { confirm() }}
            >
              {deleteMode ? 'Eliminar' : 'Guardar'}
            </button>
            <button className="modal__btn" onClick={() => { setShow(false) }}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


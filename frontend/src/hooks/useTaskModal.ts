import { useState } from 'react'
import type { Task } from '../models/task'

export function useTaskModal(
  onAddTask: (columnId: number, title: string, description?: string) => void,
  onUpdateTask: ((taskId: number, data: { title?: string; description?: string }) => void) | undefined,
  onArchiveTask: ((taskId: number) => void) | undefined,
  columnId: number
) {
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteMode, setDeleteMode] = useState(false)

  const openForCreate = () => {
    setShow(true)
    setEditingId(null)
    setDeleteMode(false)
    setTitle('')
    setDesc('')
  }

  const openForEdit = (t: Task) => {
    setShow(true)
    setEditingId(t.id)
    setDeleteMode(false)
    setTitle(t.title)
    setDesc(t.description ?? '')
  }

  const openForDelete = (t: Task) => {
    setShow(true)
    setEditingId(t.id)
    setDeleteMode(true)
    setTitle(t.title)
    setDesc(t.description ?? '')
  }

  const confirm = () => {
    if (deleteMode && editingId) {
      onArchiveTask?.(editingId)
      setShow(false)
      setEditingId(null)
      setDeleteMode(false)
      return
    }
    if (!title.trim()) return
    if (editingId) {
      onUpdateTask?.(editingId, { title: title.trim(), description: desc.trim() || undefined })
      setShow(false)
      setEditingId(null)
    } else {
      onAddTask(columnId, title.trim(), desc.trim() || undefined)
      setTitle('')
      setDesc('')
      setShow(false)
    }
  }

  return {
    show,
    setShow,
    title,
    setTitle,
    desc,
    setDesc,
    editingId,
    deleteMode,
    openForCreate,
    openForEdit,
    openForDelete,
    confirm,
  }
}

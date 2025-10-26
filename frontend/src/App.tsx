import { useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store'
import { addTaskThunk, fetchColumns, moveTaskThunk, seedBoard, updateTaskThunk, archiveTaskThunk, clearSuccess } from './store/boardSlice'
import Logo from './assets/logo.svg'
import { DndContext, DragEndEvent } from '@dnd-kit/core'

export default function App() {
  const dispatch = useDispatch()
  const columns = useSelector((s: RootState) => s.board.columns)
  const status = useSelector((s: RootState) => s.board.status)
  const error = useSelector((s: RootState) => s.board.error)
  const success = useSelector((s: RootState) => s.board.success)

  useEffect(() => {
    dispatch<any>(fetchColumns())
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded' && columns.length === 0) {
      dispatch<any>(seedBoard())
    }
  }, [status, columns.length, dispatch])

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => dispatch<any>(clearSuccess()), 2000)
    return () => clearTimeout(t)
  }, [success, dispatch])

  const addTask = (columnId: number, title: string, description?: string) => {
    dispatch<any>(addTaskThunk({ columnId, title, description }))
  }

  const moveTask = (taskId: number, toColumnId: number, position?: number) => {
    dispatch<any>(moveTaskThunk({ taskId, toColumnId }))
  }

  const updateTask = (taskId: number, data: { title?: string; description?: string }) => {
    dispatch<any>(updateTaskThunk({ taskId, ...data }))
  }

  const archiveTask = (taskId: number) => {
    dispatch<any>(archiveTaskThunk({ taskId }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const taskId = Number(active.id)
    if (over.id === 'trash') {
      archiveTask(taskId)
      return
    }
    const toColumnId = Number(over.id)
    moveTask(taskId, toColumnId)
  }


  return (
    <DndContext onDragEnd={handleDragEnd}>
      {success && (<div className="alert alert--success">{success}</div>)}
      <div className="kanban-page">
        <div className='kanban-page__containter'>
          <div className="kanban-page__containter__header">
          <img src={Logo} className='kanban-page__containter__header__logo'/>
          <h1 className='kanban-page__containter__header__title'>Tablero Kanban</h1>
          </div>
        {status === 'loading' && <div>Cargando...</div>}
        {error && (<div className="alert alert--error">{error}</div>)}
        <KanbanBoard columns={columns} onAddTask={addTask} onMoveTask={moveTask} onUpdateTask={updateTask} onArchiveTask={archiveTask} />
        </div>
      </div>
    </DndContext>
  )
}

import { useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store'
import { fetchColumns, seedBoard } from './store/boardSlice'
import Logo from './assets/logo.svg'
import { DndContext } from '@dnd-kit/core'
import { useBoardActions } from './hooks/useBoardActions'
import { useAutoClearSuccess } from './hooks/useAutoClearSuccess'
import { useDndHandlers } from './hooks/useDndHandlers'

export default function App() {
  const dispatch = useDispatch()
  const columns = useSelector((s: RootState) => s.board.columns)
  const status = useSelector((s: RootState) => s.board.status)
  const error = useSelector((s: RootState) => s.board.error)
  const { success, addTask, moveTask, updateTask, archiveTask } = useBoardActions()

  useEffect(() => {
    dispatch<any>(fetchColumns())
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded' && columns.length === 0) {
      dispatch<any>(seedBoard())
    }
  }, [status, columns.length, dispatch])

  useAutoClearSuccess(success, 2000)

  const { handleDragEnd } = useDndHandlers({ moveTask, archiveTask })


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

import { useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store'
import { addTaskThunk, fetchColumns, moveTaskThunk, seedBoard, updateTaskThunk } from './store/boardSlice'
import Logo from './assets/logo.svg'

export default function App() {
  const dispatch = useDispatch()
  const columns = useSelector((s: RootState) => s.board.columns)
  const status = useSelector((s: RootState) => s.board.status)

  useEffect(() => {
    dispatch<any>(fetchColumns())
  }, [dispatch])

  useEffect(() => {
    if (status === 'succeeded' && columns.length === 0) {
      dispatch<any>(seedBoard())
    }
  }, [status, columns.length, dispatch])

  const addTask = (columnId: number, title: string, description?: string) => {
    dispatch<any>(addTaskThunk({ columnId, title, description }))
  }

  const moveTask = (taskId: number, toColumnId: number, position?: number) => {
    dispatch<any>(moveTaskThunk({ taskId, toColumnId }))
  }

  const updateTask = (taskId: number, data: { title?: string; description?: string }) => {
    dispatch<any>(updateTaskThunk({ taskId, ...data }))
  }

  return (
    <div className="kanban-page">
      <div className='kanban-page__containter'>
        <div className="kanban-page__containter__header">
        <img src={Logo} className='kanban-page__containter__header__logo'/>
        <h1 className='kanban-page__containter__header__title'>Tablero Kanban</h1>
        </div>
      {status === 'loading' && <div>Cargando...</div>}
      <KanbanBoard columns={columns} onAddTask={addTask} onMoveTask={moveTask} onUpdateTask={updateTask} />
      </div>
    </div>
  )
}


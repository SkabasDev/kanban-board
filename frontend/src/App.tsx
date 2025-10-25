import { useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store'
import { addTaskThunk, fetchColumns, moveTaskThunk, seedBoard } from './store/boardSlice'

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

  const addTask = (columnId: string, title: string) => {
    dispatch<any>(addTaskThunk({ columnId, title }))
  }

  const moveTask = (taskId: string, toColumnId: string, position?: number) => {
    dispatch<any>(moveTaskThunk({ taskId, toColumnId }))
  }

  return (
    <div className="kanban-page">
      <h1>Tablero Kanban</h1>
      {status === 'loading' && <div>Cargando...</div>}
      <KanbanBoard columns={columns} onAddTask={addTask} onMoveTask={moveTask} />
    </div>
  )
}

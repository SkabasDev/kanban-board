import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { addTaskThunk, moveTaskThunk, updateTaskThunk, archiveTaskThunk } from '../store/boardSlice'

export function useBoardActions() {
  const dispatch = useDispatch()
  const columns = useSelector((s: RootState) => s.board.columns)
  const status = useSelector((s: RootState) => s.board.status)
  const error = useSelector((s: RootState) => s.board.error)
  const success = useSelector((s: RootState) => s.board.success)

  const addTask = useCallback((columnId: number, title: string, description?: string) => {
    dispatch<any>(addTaskThunk({ columnId, title, description }))
  }, [dispatch])

  const moveTask = useCallback((taskId: number, toColumnId: number) => {
    dispatch<any>(moveTaskThunk({ taskId, toColumnId }))
  }, [dispatch])

  const updateTask = useCallback((taskId: number, data: { title?: string; description?: string }) => {
    dispatch<any>(updateTaskThunk({ taskId, ...data }))
  }, [dispatch])

  const archiveTask = useCallback((taskId: number) => {
    dispatch<any>(archiveTaskThunk({ taskId }))
  }, [dispatch])

  return { columns, status, error, success, addTask, moveTask, updateTask, archiveTask }
}

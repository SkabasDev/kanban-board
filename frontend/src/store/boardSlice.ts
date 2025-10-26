import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Column } from '../models/column'
import { Task } from '../models/task'
import { api } from '../api'
import { BoardState } from './types'

const initialState: BoardState = {
  columns: [],
  status: 'idle',
}

export const fetchColumns = createAsyncThunk<Column[]>('board/fetchColumns',
  async () => {
    const res = await api('/columns')
    if (!res.ok) throw new Error('Error cargando columnas')
    return res.json()
  }
)

export const seedBoard = createAsyncThunk<Column[]>('board/seed',
  async (_, { dispatch }) => {
    await api('/boards/seed')
    const res = await api('/columns')
    if (!res.ok) throw new Error('Error cargando columnas tras seed')
    const cols = await res.json()
    return cols
  }
)

export const addTaskThunk = createAsyncThunk<Task, { columnId: number; title: string; description?: string }>('board/addTask',
  async ({ columnId, title, description }: { columnId: number; title: string; description?: string }) => {
    const res = await api('/tasks', { method: 'POST', body: JSON.stringify({ columnId, title, description }), })
    if (!res.ok) throw new Error('Error creando tarea')
    return res.json()
  }
)

export const moveTaskThunk = createAsyncThunk<{ task: Task; fromColumnId: number; toColumnId: number }, { taskId: number; toColumnId: number }>('board/moveTask', async ({ taskId, toColumnId }: { taskId: number; toColumnId: number }) => {
  const res = await api(`/tasks/${taskId}/move`, { method: 'PATCH', body: JSON.stringify({ toColumnId }), })
  if (!res.ok) throw new Error('Error moviendo tarea')
  return res.json()
})

export const updateTaskThunk = createAsyncThunk<Task, { taskId: number; title?: string; description?: string }>('board/updateTask', async ({ taskId, title, description }) => {
  const res = await api(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, description }),
  })
  if (!res.ok) throw new Error('Error actualizando tarea')
  return res.json()
})

export const archiveTaskThunk = createAsyncThunk<{ id: number; archived: boolean }, { taskId: number }>('board/archiveTask', async ({ taskId }) => {
  const res = await api(`/tasks/${taskId}/archive`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Error archivando tarea')
  return res.json()
})

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    clearSuccess(state: BoardState) {
      state.success = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (state: BoardState) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchColumns.fulfilled, (state: BoardState, action: { payload: Column[] }) => {
        state.status = 'succeeded'
        state.columns = action.payload
      })
      .addCase(fetchColumns.rejected, (state: BoardState, action: { error: { message?: string } }) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addTaskThunk.fulfilled, (state: BoardState, action: { payload: Task }) => {
        const task = action.payload
        const colId = (task as any).columnId ?? (task as any).column?.id
        const col = state.columns.find((c) => String(c.id) === String(colId))
        if (col) col.tasks.push(task)
        state.success = 'Task created successfully'
      })
      .addCase(seedBoard.pending, (state: BoardState) => {
        state.status = 'loading'
      })
      .addCase(seedBoard.fulfilled, (state: BoardState, action: { payload: Column[] }) => {
        state.status = 'succeeded'
        state.columns = action.payload
      })
      .addCase(seedBoard.rejected, (state: BoardState, action: { error: { message?: string } }) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(
        moveTaskThunk.fulfilled,
        (
          state: BoardState,
          action: { payload: { task: Task; fromColumnId: number; toColumnId: number } }
        ) => {
          const { task, fromColumnId, toColumnId } = action.payload
          const from = state.columns.find((c) => c.id === fromColumnId)
          if (from) from.tasks = from.tasks.filter((t) => t.id !== task.id)
          const to = state.columns.find((c) => c.id === toColumnId)
          if (to) to.tasks.push(task)
        }
      )
      .addCase(updateTaskThunk.fulfilled, (state: BoardState, action: { payload: Task }) => {
        const updated = action.payload
        for (const col of state.columns) {
          const idx = col.tasks.findIndex(t => t.id === updated.id)
          if (idx !== -1) {
            col.tasks[idx] = { ...col.tasks[idx], ...updated }
            break
          }
        }
        state.success = 'Task updated successfully'
      })
      .addCase(updateTaskThunk.rejected, (state: BoardState, action: { error: { message?: string } }) => {
        state.error = action.error.message
      })
      .addCase(archiveTaskThunk.fulfilled, (state: BoardState, action: { payload: { id: number; archived: boolean } }) => {
        const taskId = action.payload.id
        for (const col of state.columns) {
          const before = col.tasks.length
          col.tasks = col.tasks.filter(t => t.id !== taskId)
          if (col.tasks.length !== before) break
        }
        state.success = 'Task deleted successfully'
      })
      .addCase(addTaskThunk.pending, (state: BoardState) => { state.error = undefined; state.success = undefined })
      .addCase(moveTaskThunk.pending, (state: BoardState) => { state.error = undefined; state.success = undefined })
      .addCase(updateTaskThunk.pending, (state: BoardState) => { state.error = undefined; state.success = undefined })
      .addCase(archiveTaskThunk.pending, (state: BoardState) => { state.error = undefined; state.success = undefined })
  },
})

export const { clearSuccess } = boardSlice.actions
export default boardSlice.reducer

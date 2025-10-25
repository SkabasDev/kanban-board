import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Column } from '../interfaces/column'
import { Task } from '../interfaces/task'
import { api } from '../api'

export type BoardState = {
  columns: Column[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: BoardState = {
  columns: [],
  status: 'idle',
}

export const fetchColumns = createAsyncThunk<Column[]>(
  'board/fetchColumns',
  async () => {
    const res = await api('/columns')
    if (!res.ok) throw new Error('Error cargando columnas')
    return res.json()
  }
)

export const seedBoard = createAsyncThunk<Column[]>(
  'board/seed',
  async (_, { dispatch }) => {
    // seed default board/columns on backend, then load columns
    await api('/boards/seed')
    const res = await api('/columns')
    if (!res.ok) throw new Error('Error cargando columnas tras seed')
    const cols = await res.json()
    // also push into state by returning
    return cols
  }
)

export const addTaskThunk = createAsyncThunk<Task, { columnId: string; title: string; description?: string }>(
  'board/addTask',
  async ({ columnId, title, description }: { columnId: string; title: string; description?: string }) => {
    const res = await api('/tasks', {
      method: 'POST',
      body: JSON.stringify({ columnId, title, description }),
    })
    if (!res.ok) throw new Error('Error creando tarea')
    return res.json()
  }
)

export const moveTaskThunk = createAsyncThunk<
  { task: Task; fromColumnId: string; toColumnId: string },
  { taskId: string; toColumnId: string }
>('board/moveTask', async ({ taskId, toColumnId }: { taskId: string; toColumnId: string }) => {
  const res = await api(`/tasks/${taskId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ toColumnId }),
  })
  if (!res.ok) throw new Error('Error moviendo tarea')
  return res.json()
})

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
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
        const col = state.columns.find((c) => c.id === (task as any).column?.id || (task as any).columnId)
        if (col) col.tasks.push(task)
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
          action: { payload: { task: Task; fromColumnId: string; toColumnId: string } }
        ) => {
          const { task, fromColumnId, toColumnId } = action.payload
          const from = state.columns.find((c) => c.id === fromColumnId)
          if (from) from.tasks = from.tasks.filter((t) => t.id !== task.id)
          const to = state.columns.find((c) => c.id === toColumnId)
          if (to) to.tasks.push(task)
        }
      )
  },
})

export default boardSlice.reducer

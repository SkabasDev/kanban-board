import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import boardReducer from '../store/boardSlice'
import type { BoardState } from '../store/types'
import App from '../App'
import { render, screen } from '@testing-library/react'

vi.mock('../api', () => ({
  BASE_URL: 'http://localhost:3000',
  api: vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) }),
}))

function makeStore(preloadedBoard: Partial<BoardState> = {}) {
  return configureStore({
    reducer: { board: boardReducer } as any,
    preloadedState: {
      board: {
        columns: [],
        status: 'idle',
        error: undefined,
        success: undefined,
        ...preloadedBoard,
      },
    } as any,
  })
}

describe('App alerts', () => {
  beforeEach(() => {
    // reset mocks
  })

  it('shows success alert when success message exists', async () => {
    const store = makeStore({ success: 'Task created successfully' })
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(await screen.findByText('Task created successfully')).toBeInTheDocument()
  })

  it('shows error alert when error exists', async () => {
    const store = makeStore({ error: 'Network error' })
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(await screen.findByText('Network error')).toBeInTheDocument()
  })
})

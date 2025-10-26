import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Column from '../components/Column'
import type { Column as ColumnType } from '../models/column'

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ isOver: false, setNodeRef: () => {} }),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    isDragging: false,
  }),
}))

const makeColumn = (overrides: Partial<ColumnType> = {}): ColumnType => ({
  id: 1,
  name: 'ToDo',
  tasks: [
    { id: 11, title: 'Task A' },
    { id: 12, title: 'Task B' },
  ],
  ...overrides,
})

describe('Column list', () => {
  it('renders tasks titles', () => {
    render(
      <Column
        column={makeColumn()}
        onAddTask={() => {}}
        onMoveTask={() => {}}
      />
    )
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
  })
})

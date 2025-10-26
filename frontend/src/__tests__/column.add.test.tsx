import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Column from '../components/Column'
import type { Column as ColumnType } from '../models/column'

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ isOver: false, setNodeRef: () => {} }),
}))

const makeColumn = (overrides: Partial<ColumnType> = {}): ColumnType => ({
  id: 1,
  name: 'ToDo',
  tasks: [],
  ...overrides,
})

describe('Column add task', () => {
  it('opens modal and calls onAddTask with title/description', () => {
    const onAddTask = vi.fn()
    render(
      <Column
        column={makeColumn()}
        onAddTask={onAddTask}
        onMoveTask={() => {}}
      />
    )

    // abrir modal
    fireEvent.click(screen.getByText('Añadir'))

    // llenar inputs
    const title = screen.getByPlaceholderText('Ej. Diseñar pantalla de login') as HTMLInputElement
    const desc = screen.getByPlaceholderText('Detalles opcionales de la tarea') as HTMLTextAreaElement
    fireEvent.change(title, { target: { value: 'Nueva tarea' } })
    fireEvent.change(desc, { target: { value: 'Detalle' } })

    // guardar
    fireEvent.click(screen.getByText('Guardar'))

    expect(onAddTask).toHaveBeenCalledWith(1, 'Nueva tarea', 'Detalle')
  })
})

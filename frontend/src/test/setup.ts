import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Global mock for dnd-kit hooks used by components during tests
vi.mock('@dnd-kit/core', () => ({
  // minimal DndContext that just renders children (no JSX here)
  DndContext: ({ children }: any) => children,
  useDroppable: () => ({ isOver: false, setNodeRef: () => {} }),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    isDragging: false,
  }),
}))

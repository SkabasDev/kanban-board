import { useCallback } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'

export function useDndHandlers({
  moveTask,
  archiveTask,
}: {
  moveTask: (taskId: number, toColumnId: number) => void
  archiveTask: (taskId: number) => void
}) {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return
      const taskId = Number(active.id)
      if (over.id === 'trash') {
        archiveTask(taskId)
        return
      }
      const toColumnId = Number(over.id)
      moveTask(taskId, toColumnId)
    },
    [moveTask, archiveTask]
  )

  return { handleDragEnd }
}

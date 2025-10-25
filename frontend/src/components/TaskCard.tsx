import { Column } from '../interfaces/column'
import { Task } from '../interfaces/task'

export default function TaskCard({ task, columns, onMove }: { task: Task; columns: Column[]; onMove: (toColumnId: string) => void }) {
  const toDo = columns.find(c => c.name === 'ToDo')
  const doing = columns.find(c => c.name === 'Doing')
  const done = columns.find(c => c.name === 'Done')
  return (
    <div className="task-card" style={{ background: 'white', border: '1px solid #ddd', borderRadius: 6, padding: 8 }}>
      <div className="task-card__title" style={{ fontWeight: 600 }}>{task.title}</div>
      <div className="task-card__actions" style={{ marginTop: 6, display: 'flex', gap: 6 }}>
        {toDo && <button className="task-card__btn" onClick={() => onMove(toDo.id)}>A Pendiente</button>}
        {doing && <button className="task-card__btn" onClick={() => onMove(doing.id)}>A En Progreso</button>}
        {done && <button className="task-card__btn" onClick={() => onMove(done.id)}>A Completada</button>}
      </div>
    </div>
  )
}

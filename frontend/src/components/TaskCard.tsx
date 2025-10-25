import { Task } from '../types'

export default function TaskCard({ task, onMove }: { task: Task, onMove: (toColumnId: string) => void }) {
  return (
    <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 6, padding: 8 }}>
      <div style={{ fontWeight: 600 }}>{task.title}</div>
      <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
        <button onClick={() => onMove('todo')}>A ToDo</button>
        <button onClick={() => onMove('doing')}>A Doing</button>
        <button onClick={() => onMove('done')}>A Done</button>
      </div>
    </div>
  )
}

import { useEffect } from 'react'

export default function Modal({ open, title, onClose, children }: {
  open: boolean
  title?: string
  onClose: () => void
  children?: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal__dialog" onClick={e => e.stopPropagation()}>
        {title && <div className="modal__header"><h3 className="modal__title">{title}</h3></div>}
        {children}
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearSuccess } from '../store/boardSlice'

export function useAutoClearSuccess(success?: string, delay = 2000) {
  const dispatch = useDispatch()
  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => dispatch<any>(clearSuccess()), delay)
    return () => clearTimeout(t)
  }, [success, delay, dispatch])
}

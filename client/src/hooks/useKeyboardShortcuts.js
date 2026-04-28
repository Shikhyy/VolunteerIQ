import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const keyBuffer = useRef('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector('[data-search-trigger]')?.click()
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        alert('Keyboard Shortcuts:\n\nCtrl+K: Search\nG+D: Dashboard\nG+T: Tasks\nG+M: Map\nG+A: Admin')
        return
      }

      if (e.key === 'g' || e.key === 'G') {
        keyBuffer.current = 'g'
        setTimeout(() => {
          keyBuffer.current = ''
        }, 500)
        return
      }

      if (keyBuffer.current === 'g') {
        e.preventDefault()
        keyBuffer.current = ''
        
        switch (e.key.toLowerCase()) {
          case 'd':
            navigate('/dashboard')
            break
          case 't':
            navigate('/tasks')
            break
          case 'm':
            navigate('/map')
            break
          case 'a':
            navigate('/admin')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}
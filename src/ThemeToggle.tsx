import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { toggleTheme } from './theme'

export default function ThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean>(() => document.documentElement.classList.contains('dark'))

  React.useEffect(() => {
    document.documentElement.classList.add('transition-colors', 'duration-200', 'ease-out')
  }, [])

  function onClick() {
    const next = toggleTheme()
    setIsDark(next === 'dark')
  }

  return (
    <button onClick={onClick} aria-label="Toggle theme" className="btn">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}


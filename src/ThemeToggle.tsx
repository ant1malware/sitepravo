import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { toggleTheme } from './theme'
import Button from './ui/Button'

export default function ThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean>(() => document.documentElement.classList.contains('dark'))

  function onClick() {
    const next = toggleTheme()
    setIsDark(next === 'dark')
  }

  return (
    <Button onClick={onClick} aria-label="Toggle theme">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}


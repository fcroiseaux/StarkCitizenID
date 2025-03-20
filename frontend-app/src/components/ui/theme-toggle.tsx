"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/i18n/language-context"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button 
      onClick={toggleTheme} 
      className="appearance-none bg-transparent border-none p-0 m-0 shadow-none outline-none w-10 h-10 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:rotate-[15deg]"
      aria-label={t('theme.toggle')}
      title={t('theme.toggle')}
      style={{ backgroundColor: 'transparent' }}
    >
      <span className="text-2xl">{theme === 'light' ? '🌙' : '☀️'}</span>
    </button>
  )
}

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

  return (
    <div className="flex items-center">
      <label 
        htmlFor="theme-toggle" 
        className="inline-block cursor-pointer"
        aria-label={t('theme.toggle')}
      >
        <div className="relative">
          <input
            type="checkbox"
            id="theme-toggle"
            className="sr-only"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner dark:bg-gray-700 transition-colors"></div>
          <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform ${
            theme === "dark" ? "translate-x-5" : ""
          }`}></div>
        </div>
        <span className="sr-only">{t('theme.toggle')}</span>
      </label>
    </div>
  )
}

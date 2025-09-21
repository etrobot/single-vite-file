import { useTheme } from './ThemeContext'
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="bg-zinc-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 border-none rounded-full w-10 h-10 cursor-pointer flex items-center justify-center text-lg transition-all hover:bg-zinc-300 dark:hover:bg-zinc-600"
      title={isDark ? '切换到亮色主题' : '切换到暗色主题'}
      aria-label="切换主题"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

import { useTheme } from './ThemeContext'

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-none rounded-full w-10 h-10 cursor-pointer flex items-center justify-center text-lg transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
      title={isDark ? '切换到亮色主题' : '切换到暗色主题'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
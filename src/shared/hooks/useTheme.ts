import { useContext } from 'react'
import { ThemeContext, LOCAL_STORAGE_THEME_KEY, Theme } from '@/app/providers/theme'

interface UseThemeResult {
	theme: Theme
	toggleTheme: () => void
}

export const useTheme = (): UseThemeResult => {
	
	const { theme, setTheme } = useContext(ThemeContext)

	const toggleTheme = () => {
		const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
		localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme)
		setTheme(newTheme)
	}

	return { theme, toggleTheme }
}
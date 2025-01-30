import { createContext, ReactNode, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export enum Theme {
  LIGHT = 'theme-color-light',
  DARK = 'theme-color-dark'
}

interface ThemeContextProps {
	theme: Theme
	setTheme: (theme: Theme) => void
}

interface ThemeProviderProps {
	children: ReactNode
}

export const LOCAL_STORAGE_THEME_KEY = 'theme'

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextProps>({
	theme: Theme.LIGHT,
	setTheme: () => undefined,
})

const defaultTheme =
	(localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || Theme.DARK

export const ThemeProvider = (props: ThemeProviderProps) => {
	const { children } = props

	const [theme, setTheme] = useState<Theme>(defaultTheme)

  document.body.className = theme;

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

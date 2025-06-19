import { useState } from 'react';
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from './theme-context';

const defaultTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || Theme.DARK;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(defaultTheme);

	document.body.className = theme;

	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

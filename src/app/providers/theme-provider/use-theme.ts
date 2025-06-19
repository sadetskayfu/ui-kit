import { useContext } from 'react';
import { ThemeContext, LOCAL_STORAGE_THEME_KEY, Theme } from './theme-context';

export const useTheme = () => {
	const { theme, setTheme } = useContext(ThemeContext);

	const toggleTheme = (value?: Theme) => {
		let newTheme: Theme;

		if (value) {
			newTheme = value;
		} else {
			newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
		}

		localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);

		setTheme(newTheme);
	};

	return { theme, toggleTheme };
};

import { MenuItemContext, type MenuItemContextType } from './menu-item-context';

interface MenuItemProviderProps extends MenuItemContextType {
	children: React.ReactNode;
}

export const MenuItemProvider = ({ children, ...contextProps }: MenuItemProviderProps) => {
	return <MenuItemContext.Provider value={{ ...contextProps }}>{children}</MenuItemContext.Provider>;
};
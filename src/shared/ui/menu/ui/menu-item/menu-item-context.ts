import { createContext } from "react";

type MenuItemBorderRadius = 'm' | 'none'

export type MenuItemContextType = {
	borderRadius?: MenuItemBorderRadius;
};

export const MenuItemContext= createContext<MenuItemContextType | null>(null)
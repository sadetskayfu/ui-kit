import { createContext } from "react";

export type MenuSizeContextType = {
	width?: number
};

export const MenuSizeContext= createContext<MenuSizeContextType | null>(null)
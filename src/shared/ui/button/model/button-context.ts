import { createContext } from "react";

type ButtonVariant = 'filled' | 'outlined' | 'clear';
type ButtonSize = 'xs' | 's' | 'm' | 'l';
type ButtonColor = 'primary' | 'secondary' | 'red' | 'green';
type ButtonBorderPlacement = 'left' | 'right' | 'top' | 'bottom' | 'all';
type ButtonBorderRadius = 'm' | 'full' | 'circular' | 'none';

export type ButtonContextType = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	borderPlacement?: ButtonBorderPlacement;
	borderRadius?: ButtonBorderRadius;
	color?: ButtonColor;
    iconButton?: boolean
    disabled?: boolean
};

export const ButtonContext = createContext<ButtonContextType | null>(null)
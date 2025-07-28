import * as React from "react";

type ButtonVariant = 'filled' | 'outlined' | 'clear';
type ButtonSize = 'xs' | 's' | 'm' | 'l';
type ButtonColor = 'primary' | 'secondary' | 'red' | 'green';

export type ButtonVariantContext = {
    /**
     * @default 'filled'
     */
	variant?: ButtonVariant;
        /**
     * @default 'm'
     */
	size?: ButtonSize;
        /**
     * @default 'primary'
     */
	color?: ButtonColor;
        /**
     * @default false
     */
    iconButton?: boolean
    disabled?: boolean
};

export const ButtonVariantContext = React.createContext<ButtonVariantContext | undefined>(undefined)

export function useButtonVariantContext() {
    return React.useContext(ButtonVariantContext)
}
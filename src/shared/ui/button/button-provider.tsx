import { ButtonContext, type ButtonContextType } from './model/button-context';

interface ButtonProviderProps extends ButtonContextType {
	children: React.ReactNode;
}

export const ButtonProvider = ({ children, ...contextProps }: ButtonProviderProps) => {
	return <ButtonContext.Provider value={{ ...contextProps }}>{children}</ButtonContext.Provider>;
};

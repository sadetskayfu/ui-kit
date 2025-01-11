export const getFirstLetter = (str: string | undefined, letter: string = 'U') => {
	if (!str) return letter
    
	return str.charAt(0)
}

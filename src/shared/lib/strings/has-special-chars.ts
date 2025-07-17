export function hasSpecialChars(str: string) {
    const regex = /[^a-zA-Zа-яА-Я0-9\s]/
    
    return regex.test(str)
}
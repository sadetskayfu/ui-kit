import { hasSpecialChars } from "@/shared/lib/strings"

export function validateTemplateName(value: string) {
    if(value.length === 0) {
        return 'Минимальная длина 1 символ'
    }
    if(hasSpecialChars(value)) {
        return 'Название не должно содержать специальных символов'
    }
	if(value.length > 32) {
        return 'Максимальная длина 32 символа'
    }
}
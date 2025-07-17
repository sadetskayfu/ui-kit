import { useContext } from "react"
import { MenuContext } from "./menu-context"

export const useMenuContext = () => {
    return useContext(MenuContext)
}
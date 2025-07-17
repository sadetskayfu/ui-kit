import { useContext } from "react";
import { ButtonContext } from "./button-context";

export function useButtonContext() {
    const context = useContext(ButtonContext)

    return context
}
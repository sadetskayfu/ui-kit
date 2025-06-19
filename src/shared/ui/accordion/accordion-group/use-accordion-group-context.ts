import { useContext } from "react";
import { AccordionGroupContext } from "./accordion-group-context";

export function useAccordionGroupContext(){
    const context = useContext(AccordionGroupContext)

    return context
}
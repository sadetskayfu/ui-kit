import { colorGreenVariables, colorGreyVariables, colorOrangeVariables, colorPrimaryVariables, colorRedVariables } from "../../model/variables"
import { ColorAccordion } from "../color-accordion/color-accordion"
import { useInitTemplate } from "../../model/use-init-template"
import styles from './variables-section.module.scss'
import { useEffect, useState } from "react"

const regex = /\b(hue|saturation|lightness)\b/

const correctedColorPrimaryVariables = colorPrimaryVariables.filter((variable) => !regex.test(variable))
const correctedColorGreyVariables = colorGreyVariables.filter((variable) => !regex.test(variable))
const correctedColorRedVariables = colorRedVariables.filter((variable) => !regex.test(variable))
const correctedColorGreenVariables = colorGreenVariables.filter((variable) => !regex.test(variable))
const correctedColorOrangeVariables = colorOrangeVariables.filter((variable) => !regex.test(variable))

export const VariablesSection = () => {
    const [ready, setReady] = useState<boolean>(false)

    useInitTemplate()

    useEffect(() => {
        setTimeout(() => {
            setReady(true)
        }, 0)
    }, [])

    if (!ready) {
        return null
    }

    return (
        <section className={styles['variables-section']}>
            <ColorAccordion variables={correctedColorPrimaryVariables} title="Primary color" />
            <ColorAccordion variables={correctedColorGreyVariables} title="Grey color" />
            <ColorAccordion variables={correctedColorRedVariables} title="Red color" />
            <ColorAccordion variables={correctedColorGreenVariables} title="Green color" />
            <ColorAccordion variables={correctedColorOrangeVariables} title="Orange color" />
        </section>
    )
}
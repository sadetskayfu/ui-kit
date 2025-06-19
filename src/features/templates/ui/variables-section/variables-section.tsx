import { colorGreenVariables, colorGreyVariables, colorPrimaryVariables, colorRedVariables } from "../../model/variables"
import { ColorAccordion } from "../color-accordion/color-accordion"
import { useInitTemplate } from "../../model/use-init-template"
import styles from './variables-section.module.scss'

const regex = /\b(hue|saturation|lightness)\b/

const correctedColorPrimaryVariables = colorPrimaryVariables.filter((variable) => !regex.test(variable))
const correctedColorGreyVariables = colorGreyVariables.filter((variable) => !regex.test(variable))
const correctedColorRedVariables = colorRedVariables.filter((variable) => !regex.test(variable))
const correctedColorGreenVariables = colorGreenVariables.filter((variable) => !regex.test(variable))

export const VariablesSection = () => {
    useInitTemplate()

    return (
        <section className={styles['variables-section']}>
            <ColorAccordion variables={correctedColorPrimaryVariables} title="Primary color" />
            <ColorAccordion variables={correctedColorGreyVariables} title="Grey color" />
            <ColorAccordion variables={correctedColorRedVariables} title="Red color" />
            <ColorAccordion variables={correctedColorGreenVariables} title="Green color" />
        </section>
    )
}
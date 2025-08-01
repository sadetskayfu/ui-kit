import { Tabs } from "@/shared/ui/tabs"
import { useTemplatesStore } from "../../model/templates-store";
import { ColorPicker } from "../color-picker/color-picker";

interface ColorTabPanel {
    variables: string[];
}

export const ColorTabPanel = ({ variables: variablesProp }: ColorTabPanel) => {
    const activeTemplateId = useTemplatesStore(state => state.activeTemplateId)
	const variables = useTemplatesStore(state => state.templates.find((template) => template.id === activeTemplateId)?.variables || {});
	const setVariable = useTemplatesStore(state => state.setColorVariable);

	const renderItems = () => {
		return variablesProp.map(cssVariable => {
			const color = variables[cssVariable]
			return (
				<ColorPicker
					key={cssVariable}
					cssVariable={cssVariable}
					value={color}
					onChange={color => setVariable(cssVariable, color)}
				/>
			)
		});
	}

    return (
        <Tabs.Panel>
            {renderItems()}
        </Tabs.Panel>
    )
}


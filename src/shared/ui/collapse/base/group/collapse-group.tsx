import * as React from 'react';
import { CollapseGroupContext } from './collapse-group-context';
import { useEventCallback } from '@/shared/hooks';

export const CollapseGroup = ({ children, defaultOpen, multi }: CollapseGroup.Props) => {
	const [value, setValue] = React.useState<string | string[] | null>(defaultOpen ? defaultOpen : (multi ? [] : null));

    const handleChange = useEventCallback((panelValue: string) => {
        if (multi && Array.isArray(value)) {
            const hasValue = value.includes(panelValue)

            if (hasValue) {
                setValue(value.filter((value) => value !== panelValue))
            } else {
                setValue([...value, panelValue])
            }
        } else {
            setValue(panelValue)
        }
    })

    const closeAll = useEventCallback(() => {
        if (multi && Array.isArray(value)) {
            setValue([])
        } else {
            setValue(null)
        }
    })

    const contextValue: CollapseGroupContext = React.useMemo(
		() => ({ value, onChange: handleChange, closeAll }),
		[value, handleChange, closeAll]
	);

	return (
		<CollapseGroupContext.Provider value={contextValue}>
			{children}
		</CollapseGroupContext.Provider>
	);
};

export namespace CollapseGroup {
	export interface Props {
		children?: React.ReactNode;
		defaultOpen?: string | string[];
        multi?: boolean
	}
}

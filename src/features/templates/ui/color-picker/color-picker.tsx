import { memo, useCallback, useState } from 'react';
import { ChromePicker, type ColorResult } from 'react-color';
import styles from './color-picker.module.scss';

interface ColorPickerProps {
	value: string;
	onChange: (color: ColorResult) => void;
	cssVariable: string;
}

export const ColorPicker = memo(
	({ value: externalValue, onChange, cssVariable }: ColorPickerProps) => {
		const [value, setValue] = useState<string>(externalValue);
		
		const handleChange = useCallback((color: ColorResult) => {
			setValue(color.hex);
		}, []);

		return (
			<div className={styles['color-picker']}>
				<span className={styles['color-label']}>{value}</span>
				{cssVariable}
				{/* <Popover offset={12} arrow>
					<PopoverTrigger>
						<button
							className={styles['button']}
							style={{ backgroundColor: value }}
						></button>
					</PopoverTrigger>
					<PopoverContent contentClassName={styles['popover']}>
						<ChromePicker
							color={value}
							disableAlpha
							onChange={handleChange}
							onChangeComplete={onChange}
						/>
					</PopoverContent>
				</Popover> */}
			</div>
		);
	}
);

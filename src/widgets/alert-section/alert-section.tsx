import * as React from 'react';
import { Alert } from '@/shared/ui/alert';
import { Section } from '@/shared/ui/section';
import { CheckMarkIcon, XMarkIcon } from '@/shared/ui/icons';
import { FormGroup } from '@/shared/ui/form-group';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { FormControlLabel } from '@/shared/ui/form-control-label';
import styles from './alert-section.module.scss';

type AlertObject = {
	title: string;
	description: string;
	severity: 'info' | 'error' | 'warning' | 'success';
	variant: 'filled' | 'outlined';
	icon: React.ReactElement;
};
const alerts: AlertObject[] = [
	{
		title: 'Info Filled Alert',
		description: 'Severity info, variant filled',
		severity: 'info',
		variant: 'filled',
		icon: <CheckMarkIcon variant="clear" />,
	},
	{
		title: 'Info Outlined Alert',
		description: 'Severity info, variant outlined',
		severity: 'info',
		variant: 'outlined',
		icon: <CheckMarkIcon variant="clear" />,
	},
	{
		title: 'Error Filled Alert',
		description: 'Severity error, variant filled',
		severity: 'error',
		variant: 'filled',
		icon: <CheckMarkIcon variant="clear" />,
	},
	{
		title: 'Error Outlined Alert',
		description: 'Severity error, variant outlined',
		severity: 'error',
		variant: 'outlined',
		icon: <CheckMarkIcon variant="clear" />,
	},
	{
		title: 'Warning Filled Alert',
		description: 'Severity warning, variant filled',
		severity: 'warning',
		variant: 'filled',
		icon: <CheckMarkIcon variant="clear" />,
	},
	{
		title: 'Warning Outlined Alert',
		description: 'Severity warning, variant outlined',
		severity: 'warning',
		variant: 'outlined',
		icon: <CheckMarkIcon variant="clear" />,
	},
	{
		title: 'Success Filled Alert',
		description: 'Severity success, variant filled',
		severity: 'success',
		variant: 'filled',
		icon: <CheckMarkIcon variant="clear" />,
	},
	{
		title: 'Success Outlined Alert',
		description: 'Severity success, variant outlined',
		severity: 'success',
		variant: 'outlined',
		icon: <CheckMarkIcon variant="clear" />,
	},
];
type DisplayVariantValue = 'Icon' | 'Desc' | 'Actions';

const displayVariantValues: DisplayVariantValue[] = ['Icon', 'Desc', 'Actions'];

export const AlertSection = React.memo(() => {
	const [variants, setVariants] = React.useState<DisplayVariantValue[]>([
		'Icon',
		'Actions',
		'Desc',
	]);

	return (
		<Section title="Alert" contentClassName={styles['content']}>
			<FormGroup label="Variants" orientation='horizontal' hiddenLabel value={variants} onChange={setVariants}>
				{displayVariantValues.map((value, index) => (
					<FormControlLabel label={value}>
						<Checkbox key={value} value={value} offset={index === 0 ? 'left' : undefined}/>
					</FormControlLabel>
				))}
			</FormGroup>
			<div className={styles['list']}>
				{alerts.map(alert => (
					<Alert
						key={alert.title}
						{...alert}
						description={variants.includes('Desc') ? alert.description : undefined}
						icon={variants.includes('Icon') ? alert.icon : undefined}
						actions={
							variants.includes('Actions') ? (
								<Button
									variant="clear"
									color="secondary"
									size="xs"
									borderRadius="circular"
									iconButton
                                    aria-label='Test visual button'
								>
									<XMarkIcon />
								</Button>
							) : undefined
						}
					/>
				))}
			</div>
		</Section>
	);
});

import { Button } from '@/shared/ui/button';
import { memo } from 'react';
import styles from './buttons.module.scss';

export const Buttons = memo(() => {
	return (
		<div className={styles['button-list']}>
			<Button variant="filled" color="primary">
				Filled primary
			</Button>
			<Button variant="outlined" color="primary">
				Outlined primary
			</Button>
			<Button variant="clear" color="primary">
				Clear primary
			</Button>
			<Button variant="filled" color="secondary">
				Filled secondary
			</Button>
			<Button variant="outlined" color="secondary">
				Outlined secondary
			</Button>
			<Button variant="clear" color="secondary">
				Clear secondary
			</Button>
			<Button variant="filled" color="red">
				Filled red
			</Button>
			<Button variant="outlined" color="red">
				Outlined red
			</Button>
			<Button variant="clear" color="red">
				Clear red
			</Button>
		</div>
	);
});

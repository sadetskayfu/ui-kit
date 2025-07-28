import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { Button, ButtonVariantProvider } from '@/shared/ui/button';
import { ArrowIcon } from '@/shared/ui/icons';
import { BasePagination } from '../base';
import styles from './pagination.module.scss';

export const Pagination = React.memo((props: Pagination.Props) => {
	const { className, ...otherProps } = props;

	return (
		<ButtonVariantProvider size="m" color="secondary" variant="filled" iconButton>
			<BasePagination.Root
				className={classNames(styles['pagination'], [className])}
				{...otherProps}
			>
				<BasePagination.BackButton
					render={
						<Button>
							<ArrowIcon direction="left" size='xs'/>
						</Button>
					}
				/>
				<BasePagination.Buttons
					renderButton={({ page, current, ...otherProps }) => (
						<Button color={current ? 'primary' : 'secondary'} disableRipple={current ? true : false} {...otherProps}>
							{page}
						</Button>
					)}
					renderSpace={() => <span className={styles['space']}>...</span>}
				/>
				<BasePagination.ForwardButton
					render={
						<Button>
							<ArrowIcon direction="right" size='xs'/>
						</Button>
					}
				/>
			</BasePagination.Root>
		</ButtonVariantProvider>
	);
});

export namespace Pagination {
	export interface Props extends Omit<BasePagination.Root.Props, 'className' | 'render'> {
		className?: string;
	}
}

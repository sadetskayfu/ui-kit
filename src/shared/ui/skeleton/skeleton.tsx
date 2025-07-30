import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { useBorderContext } from '@/shared/ui/border-provider';
import styles from './skeleton.module.scss';

export const Skeleton = React.memo((props: Skeleton.Props) => {
	const { className, ...otherProps } = props;

	const borderContext = useBorderContext();

	return (
		<span
			className={classNames(styles['skeleton'], [className, borderContext?.borderClassName])}
			aria-hidden="true"
			{...otherProps}
		/>
	);
});

export namespace Skeleton {
	export interface Props extends React.ComponentPropsWithoutRef<'span'> {   
    }
}

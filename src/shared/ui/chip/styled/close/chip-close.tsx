import { BaseChip } from '../../base';
import { classNames } from '@/shared/helpers/class-names';
import { XMarkIcon } from '@/shared/ui/icons';
import styles from './chip-close.module.scss';

export const ChipClose = (props: ChipClose.Props) => {
	const { className, ...otherProps } = props;

	return (
		<BaseChip.Close
			className={classNames(styles['close-button'], [
				className,
			])}
			{...otherProps}
		>
            <XMarkIcon />
        </BaseChip.Close>
	);
};

export namespace ChipClose {
	export interface Props extends Omit<BaseChip.Close.Props, 'className' | 'render'> {
		className?: string;
	}
}

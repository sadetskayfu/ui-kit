import { classNames } from '@/shared/helpers/class-names';
import { useDrawerRootContext } from '../../base';
import styles from './drawer-indicator.module.scss';

export const DrawerIndicator = ({ className, style }: DrawerIndicator.Props) => {
	const { position } = useDrawerRootContext();

	return (
		<span
			className={classNames(styles['indicator'], [className, styles[`position-${position}`]])}
            style={style}
			aria-hidden="true"
		/>
	);
};

export namespace DrawerIndicator {
    export interface Props {
        className?: string
        style?: React.CSSProperties
    }
}

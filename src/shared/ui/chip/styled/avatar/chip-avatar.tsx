import { Avatar } from '@/shared/ui/avatar';
import { classNames } from '@/shared/helpers/class-names';
import styles from './chip-avatar.module.scss';

/**
 * Renders a `<Avatar>` element.
 */
export const ChipAvatar = (props: ChipAvatar.Props) => {
	const { className, ...otherProps } = props;

	return <Avatar className={classNames(styles['avatar'], [className])} {...otherProps} />;
};

export namespace ChipAvatar {
	export interface Props extends Avatar.Props {}
}

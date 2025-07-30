import * as React from 'react';
import { BaseAvatar } from '../base';
import { useBorderContext } from '@/shared/ui/border-provider';
import { classNames } from '@/shared/helpers/class-names';
import {
	AvatarVariantContext,
	useAvatarVariantContext,
} from './variant-provider/avatar-variant-context';
import { Skeleton } from '@/shared/ui/skeleton';
import styles from './avatar.module.scss';

export const Avatar = React.memo((props: Avatar.Props) => {
	const {
		className,
		alt = '',
		size,
		src,
		fallback,
		skeleton = false,
		imageProps,
		width,
		height,
		style,
		...otherProps
	} = props;

	const [imageLoadingStatus, setImageLoadingStatus] =
		React.useState<BaseAvatar.LoadingStatus>('idle');

	const borderContext = useBorderContext();
	const variantContext = useAvatarVariantContext();

	return (
		<BaseAvatar.Root
			className={classNames(styles['avatar'], [
				className,
				borderContext?.borderClassName,
				(size || variantContext?.size) && styles[`size-${size || variantContext?.size}`],
			])}
			style={{ width: width ?? variantContext?.width, height: height ?? variantContext?.height, ...style }}
			{...otherProps}
		>
			<BaseAvatar.Image
                className={styles['img']}
				onLoadingStatusChange={setImageLoadingStatus}
				src={src}
				alt={alt}
				width={width ?? variantContext?.width}
				height={height ?? variantContext?.height}
				{...imageProps}
			/>
			<BaseAvatar.Fallback className={styles['fallback']}>{fallback}</BaseAvatar.Fallback>
			{skeleton && (imageLoadingStatus === 'idle' || imageLoadingStatus === 'loading') && (
				<Skeleton className={styles['skeleton']}/>
			)}
		</BaseAvatar.Root>
	);
});

export namespace Avatar {
	export interface Props
		extends Omit<BaseAvatar.Root.Props, 'className' | 'render'>,
			AvatarVariantContext {
		className?: string;
		alt?: string;
		src?: string | undefined;
		fallback: string;
		/**
		 * @default false
		 */
		skeleton?: boolean;
		imageProps?: Omit<React.ComponentPropsWithoutRef<'img'>, 'src' | 'alt'>;
		width?: number
		height?: number
	}
}

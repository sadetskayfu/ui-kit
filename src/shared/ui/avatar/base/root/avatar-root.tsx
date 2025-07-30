import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { AvatarRootContext } from './avatar-root-context';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Renders a `<div>` element.
 */
export const AvatarRoot = React.forwardRef(
	(props: AvatarRoot.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const [imageLoadingStatus, setImageLoadingStatus] =
			React.useState<ImageLoadingStatus>('idle');

		const state: AvatarRoot.State = React.useMemo(
			() => ({
				imageLoadingStatus,
			}),
			[imageLoadingStatus]
		);

		const contextValue = React.useMemo(
			() => ({
				imageLoadingStatus,
				setImageLoadingStatus,
			}),
			[imageLoadingStatus, setImageLoadingStatus]
		);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: forwardedRef,
			props: [otherProps],
		});

		return (
			<AvatarRootContext.Provider value={contextValue}>{element}</AvatarRootContext.Provider>
		);
	}
);

export namespace AvatarRoot {
	export interface State {
		imageLoadingStatus: ImageLoadingStatus;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}

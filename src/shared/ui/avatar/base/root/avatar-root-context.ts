import * as React from 'react';
import type { ImageLoadingStatus } from './avatar-root';

export interface AvatarRootContext {
	imageLoadingStatus: ImageLoadingStatus;
	setImageLoadingStatus: React.Dispatch<React.SetStateAction<ImageLoadingStatus>>;
}

export const AvatarRootContext = React.createContext<AvatarRootContext | undefined>(undefined);

export function useAvatarRootContext() {
	const context = React.useContext(AvatarRootContext);
	if (context === undefined) {
		throw new Error(
			'AvatarRootContext is missing. Avatar parts must be placed within <Avatar.Root>.'
		);
	}
	return context;
}

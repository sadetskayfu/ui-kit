import * as React from 'react';
import { useModernLayoutEffect } from '@/shared/hooks';
import { isSafari } from '@floating-ui/react/utils';

export const FocusGuard = (props: React.ComponentPropsWithoutRef<'span'>) => {
	const [role, setRole] = React.useState<'button' | undefined>();

    // В Safari фокус запускается только кнопками
	useModernLayoutEffect(() => {
		if (isSafari()) {
			setRole('button');
		}
	}, []);

	return <span role={role} aria-hidden={role ? undefined : 'true'} tabIndex={0} {...props} />;
};

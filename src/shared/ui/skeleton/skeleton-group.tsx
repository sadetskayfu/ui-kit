import * as React from 'react';

export const SkeletonGroup = ({ children, count, min, max }: SkeletonGroup.Props) => {
	const countWithMax = typeof max === 'number' ? Math.min(count, max) : count;
	const countWithMinMax = typeof min === 'number' ? Math.max(min, countWithMax) : countWithMax;

	const skeletons = Array.from({ length: countWithMinMax }, (_, index) => (
		<React.Fragment key={index}>{children}</React.Fragment>
	));

	return skeletons;
};

export namespace SkeletonGroup {
	export interface Props {
		children: React.ReactElement;
		count: number;
		min?: number;
		max?: number;
	}
}

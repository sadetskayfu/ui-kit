import { useEffect, useRef, useState } from 'react';

type UseOptionProps = {
	optionListRef: React.RefObject<HTMLUListElement | null>;
	mounted: boolean;
	loading: boolean;
};

export function useOptions(props: UseOptionProps) {
	const { optionListRef, mounted: isMounted, loading: isLoading } = props;

	const [isOptionsReady, setIsOptionsReady] = useState<boolean>(false);
	const optionsRef = useRef<HTMLLIElement[]>([]);

	useEffect(() => {
		const optionList = optionListRef.current;
		
		if (!optionList || !isMounted || isLoading) return;
		
		const updateOptions = () => {
			const options = optionList.querySelectorAll<HTMLLIElement>("[role='option']");

			options.forEach((option, index) => {
				option.setAttribute('data-index', String(index));
			});

			optionsRef.current = Array.from(options);

			setIsOptionsReady(true);
		};
		
		const observer = new MutationObserver(updateOptions);

		observer.observe(optionList, {
			childList: true,
		});

		updateOptions();

		return () => {
			observer.disconnect();
			optionsRef.current = []
			setIsOptionsReady(false);
		};
	}, [isMounted, isLoading, optionListRef]);

	return { optionsRef, isOptionsReady, optionListRef };
}

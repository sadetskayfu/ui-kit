import { Button } from '@/shared/ui/button';
import { useState } from 'react';

interface OptionProps {
	id: string;
	name: string;
	disabled?: boolean;
	onClick: (id: string) => void;
}

export const Option = ({ id, name, disabled: isDisabled, onClick }: OptionProps) => {
	const [isRename, setIsRename] = useState<boolean>(false);

	const startRename = () => {
		setIsRename(true);
	};

	return (
		<>
			{isRename ? (
				<input />
			) : (
				<button disabled={isDisabled} onClick={() => onClick(id)}>
					{name}
					<Button onClick={startRename} iconButton>
						R
					</Button>
				</button>
			)}
		</>
	);
};

import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CompositeRoot } from './composite-root';
import { CompositeItem } from '../item/composite-item';

describe('Composite', () => {
	test('controlled mode', async () => {
		function App() {
			const [activeIndex, setActiveIndex] = React.useState(0);

			return (
				<CompositeRoot activeIndex={activeIndex} onActiveIndexChange={setActiveIndex}>
					<CompositeItem data-testid="1">1</CompositeItem>
					<CompositeItem data-testid="2">2</CompositeItem>
					<CompositeItem data-testid="3" render={(props) => <button {...props} disabled />}>3</CompositeItem>
                    <CompositeItem data-testid="4">4</CompositeItem>
				</CompositeRoot>
			);
		}

		const { getByTestId } = render(<App />);

		const item1 = getByTestId('1');
		const item2 = getByTestId('2');
		const item3 = getByTestId('3');
        const item4 = getByTestId('4');

        item1.focus()

        expect(item2).toHaveAttribute('tabindex', '-1');
        expect(item1).toHaveAttribute('tabindex', '0')
        expect(item1).toHaveFocus()
        
        fireEvent.keyDown(item1, { key: 'ArrowDown' })

        await waitFor(() => {
            expect(item1).toHaveAttribute('tabindex', '-1')
            expect(item2).toHaveAttribute('tabindex', '0');
            expect(item2).toHaveFocus();
        })

        fireEvent.keyDown(item2, { key: 'ArrowDown' })

        await waitFor(() => {
            expect(item2).toHaveAttribute('tabindex', '-1')
            expect(item3).toHaveAttribute('tabindex', '-1');
            expect(item4).toHaveAttribute('tabindex', '0');
            expect(item4).toHaveFocus();
        })

        fireEvent.keyDown(item4, { key: 'ArrowDown' })

        await waitFor(() => {
            expect(item4).toHaveAttribute('tabindex', '0');
            expect(item4).toHaveFocus();
        })

        fireEvent.keyDown(item4, { key: 'ArrowUp' })

        await waitFor(() => {
            expect(item4).toHaveAttribute('tabindex', '-1');
            expect(item2).toHaveAttribute('tabindex', '0');
            expect(item2).toHaveFocus();
        })
	});
});

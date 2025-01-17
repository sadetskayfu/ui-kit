import { KeyboardEvent } from 'react';

export const useKeyboardNavigation = (
  handleChange: (value: number) => void,
  min: number,
  max: number,
  step: number
) => {
  const handleKeyDown = (event: KeyboardEvent, currentValue: number) => {
    let newValue = currentValue;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(currentValue + step, max);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(currentValue - step, min);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    event.preventDefault();
    handleChange(newValue);
  };

  return { handleKeyDown };
};
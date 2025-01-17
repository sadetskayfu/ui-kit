// hooks/useChangeValue.ts
import { useState, useCallback, TouchEvent, MouseEvent } from 'react';

interface UseChangeValueProps {
  min: number;
  max: number;
  step: number;
  minRange?: number;
  isRange: boolean;
  onChange: (value: number | [number, number]) => void;
  initialValue: number | [number, number];
}

export const useChangeValue = ({
  min,
  max,
  step,
  minRange = 0,
  isRange,
  onChange,
  initialValue,
}: UseChangeValueProps) => {
  const [isDragging, setIsDragging] = useState<null | 'left' | 'right'>(null);
  const [value, setValue] = useState(initialValue);

  const calculateValue = useCallback(
    (clientX: number, trackRect: DOMRect) => {
      const percentage = (clientX - trackRect.left) / trackRect.width;
      const rawValue = min + (max - min) * percentage;
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.min(Math.max(steppedValue, min), max);
    },
    [min, max, step]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      const track = document.querySelector('.slider-track') as HTMLElement;
      if (!track || !isDragging) return;

      const trackRect = track.getBoundingClientRect();
      const newValue = calculateValue(clientX, trackRect);

      if (isRange && Array.isArray(value)) {
        const [leftValue, rightValue] = value;
        if (isDragging === 'left') {
          if (newValue <= rightValue - minRange) {
            const updatedValue: [number, number] = [newValue, rightValue];
            setValue(updatedValue);
            onChange(updatedValue);
          }
        } else {
          if (newValue >= leftValue + minRange) {
            const updatedValue: [number, number] = [leftValue, newValue];
            setValue(updatedValue);
            onChange(updatedValue);
          }
        }
      } else if (!isRange && !Array.isArray(value)) {
        setValue(newValue);
        onChange(newValue);
      }
    },
    [isDragging, value, onChange, calculateValue, isRange, minRange]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      handleMove(event.clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      handleMove(event.touches[0].clientX);
    },
    [handleMove]
  );

  const startDragging = (type: 'left' | 'right') => {
    setIsDragging(type);
  };

  const stopDragging = useCallback(() => {
    setIsDragging(null);
  }, []);

  return {
    value,
    isDragging,
    startDragging,
    stopDragging,
    handleMouseMove,
    handleTouchMove,
  };
};
// Slider.tsx
import React, { useEffect, useRef } from 'react';
import styles from './Slider.module.scss';
import { SliderProps } from './types';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useChangeValue } from './hooks/useChangeValue';

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  value,
  minRange = 0,
  onChange,
  className,
}) => {
  const isRange = Array.isArray(value);
  const {
    value: currentValue,
    isDragging,
    startDragging,
    stopDragging,
    handleMouseMove,
    handleTouchMove,
  } = useChangeValue({
    min,
    max,
    step,
    minRange,
    isRange,
    onChange,
    initialValue: value,
  });

  const { handleKeyDown } = useKeyboardNavigation(
    (newValue) => {
      if (isRange && Array.isArray(currentValue)) {
        const [left, right] = currentValue;
        onChange(isDragging === 'left' ? [newValue, right] : [left, newValue]);
      } else {
        onChange(newValue);
      }
    },
    min,
    max,
    step
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', stopDragging);
      document.addEventListener('touchmove', handleTouchMove as any);
      document.addEventListener('touchend', stopDragging);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchmove', handleTouchMove as any);
      document.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, stopDragging]);

  const getThumbPosition = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const renderThumb = (value: number, type: 'left' | 'right') => (
    <div
      className={styles.sliderThumb}
      style={{ left: `${getThumbPosition(value)}%` }}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={value.toString()}
      tabIndex={0}
      onMouseDown={() => startDragging(type)}
      onTouchStart={() => startDragging(type)}
      onKeyDown={(e) => handleKeyDown(e, value)}
    />
  );

  return (
    <div className={`${styles.sliderContainer} ${className || ''}`}>
      <div className={styles.sliderTrack}>
        {isRange && Array.isArray(currentValue) && (
          <div
            className={styles.sliderRange}
            style={{
              left: `${getThumbPosition(currentValue[0])}%`,
              width: `${getThumbPosition(currentValue[1]) - getThumbPosition(currentValue[0])}%`,
            }}
          />
        )}
        {isRange && Array.isArray(currentValue) ? (
          <>
            {renderThumb(currentValue[0], 'left')}
            {renderThumb(currentValue[1], 'right')}
          </>
        ) : (
          !isRange && renderThumb(currentValue as number, 'left')
        )}
      </div>
    </div>
  );
};
export interface SliderProps {
    min: number;
    max: number;
    step: number;
    value: number | [number, number];
    minRange?: number;
    onChange: (value: number | [number, number]) => void;
    className?: string;
  }
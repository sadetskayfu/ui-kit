export const roundToStep = (value: number, min: number, step: number): number => {
    const steps = Math.round((value - min) / step)
    return min + (steps * step)
  }
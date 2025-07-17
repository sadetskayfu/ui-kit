import { useEffect } from "react";

const EMPTY = [] as unknown[];

/**
 * A React.useEffect equivalent that runs once, when the component is mounted.
 */
export function useOnMount(fn: React.EffectCallback) {
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(fn, EMPTY);
}
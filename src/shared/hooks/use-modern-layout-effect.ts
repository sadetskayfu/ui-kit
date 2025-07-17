import { useLayoutEffect } from "react";

const noop = () => {};

export const useModernLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : noop;
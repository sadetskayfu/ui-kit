import { useRef } from "react";

// eslint-disable-next-line
export function useOnFirstRender(fn: Function) {
    const isFirstRenderRef = useRef(true);
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      fn();
    }
}

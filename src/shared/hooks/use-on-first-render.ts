import { useRef } from "react";

export function useOnFirstRender(fn: Function) {
    const isFirstRenderRef = useRef(true);
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      fn();
    }
}

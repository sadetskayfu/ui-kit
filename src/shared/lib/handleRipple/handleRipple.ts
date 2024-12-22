import { RefObject } from "react";
import styles from "./style.module.scss";

export const rippleId = 'ripple'

export const handleRippleMousePosition = (
  ref: RefObject<HTMLSpanElement | null>,
  event: React.MouseEvent
) => {
  const rippleWrapper = ref?.current;
  const rect = rippleWrapper?.getBoundingClientRect();
  if (rect && rippleWrapper) {
    const ripple = document.createElement("span");
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.id = rippleId
    ripple.className = styles["ripple"];
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    rippleWrapper.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  }
};

export const handleRipple = (ref: RefObject<HTMLSpanElement | null>, isSmall: boolean = false) => {
    const rippleWrapper = ref?.current;
    const rect = rippleWrapper?.getBoundingClientRect();
    if(rippleWrapper && rect) {
        const ripple = document.createElement("span");
        ripple.id = rippleId
        ripple.className = styles[isSmall ? 'ripple-small' : 'ripple'];
        rippleWrapper.appendChild(ripple);
        const timeToRemove = isSmall ? 600 : 1000;
        setTimeout(() => ripple.remove(), timeToRemove);
    }
}
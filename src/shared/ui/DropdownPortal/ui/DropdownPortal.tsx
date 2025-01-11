import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Portal } from "@/shared/ui/Portal";
import throttle from "lodash/throttle";
import { Z_INDEX } from "@/shared/constants/zIndex";
import { Position, setPositionPortalElement } from "@/shared/lib/setPosition";
import styles from "./style.module.scss";

export type DropdownPortalPosition = Position

interface DropdownPortalProps {
  className?: string;
  position?: DropdownPortalPosition;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  parentRef: React.RefObject<HTMLElement>;
  width?: string;
  height?: string;
  transition?: boolean
  zIndex?: number;
}

export const DropdownPortal = forwardRef((props: DropdownPortalProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    position = "bottom",
    children,
    isOpen,
    onClose,
    parentRef,
    width,
    height,
    transition,
    zIndex = Z_INDEX.DROPDOWN,
  } = props;

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => dropdownRef.current!, [])

  const handleClose = useCallback(
    (event: MouseEvent) => {
      const dropdown = dropdownRef.current;
      const parent = parentRef.current;

      if(!dropdown || !parent) return

      if (
        !dropdown.contains(event.target as Node) &&
        !parent.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose, parentRef]
  );

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const handleChangePosition = useCallback(() => {
    const dropdown = dropdownRef.current
    const parent = parentRef.current

    if(dropdown && parent) {
      setPositionPortalElement(dropdown, parent, position)
    }
  }, [position, parentRef])


// Set width/height parent
useEffect(() => {
  const parent = parentRef.current
  const dropdown = dropdownRef.current

  if(!isOpen || !parent || !dropdown) return

  if(width === '100%') {
    const parentRect = parent.getBoundingClientRect()
    dropdown.style.width = `${parentRect.width / 16}rem`
  }
  if(height === '100%') {
    const parentRect = parent.getBoundingClientRect()
    dropdown.style.height = `${parentRect.height / 16}rem`
  }

}, [isOpen, width, height, parentRef])

  // Change position
  useEffect(() => {
    const parent = parentRef.current;
    const dropdown = dropdownRef.current;

    if(!parent || !dropdown || !isOpen) return
    
    const throttledHandleChanges = throttle(handleChangePosition, 100);

    const resizeObserver = new ResizeObserver(throttledHandleChanges);

    resizeObserver.observe(parent);
    resizeObserver.observe(dropdown);

    window.addEventListener("resize", throttledHandleChanges);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", throttledHandleChanges);
      throttledHandleChanges.cancel();
    };
  }, [isOpen, parentRef, handleChangePosition]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleClose);
    }
    return () => {
      window.removeEventListener('click', handleClose);
    };
  }, [isOpen, handleClose]);

  const mods: Record<string, boolean | undefined> = {
    [styles["open"]]: isOpen,
    [styles['transition']]: transition
  };

  const additionalClasses: Array<string | undefined> = [className];

  return (
    <Portal>
      <div
        className={classNames(styles["dropdown"], additionalClasses, mods)}
        ref={dropdownRef}
        onMouseDown={handleMouseDown}
        style={{
          width: width === "100%" ? '': width,
          height: height === '100%' ? '' : height,
          zIndex: isOpen ? zIndex : -1000,
        }}
        role="presentation"
      >
        {children}
      </div>
    </Portal>
  );
});

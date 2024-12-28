import {
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import throttle from "lodash/throttle";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Portal } from "@/shared/ui/Portal";
import { handleChangePosition } from "@/shared/ui/Tooltip/model/handleChangePosition";
import { throttleHandleChangePositionWithFollowCursor } from "../model/handleChangePositionWithFollowCursor";
import { Z_INDEX } from "@/shared/constants/zIndex";
import styles from "./style.module.scss";

type TooltipPositionVariant = "left" | "top" | "bottom" | "right";

interface TooltipProps {
  className?: string;
  position?: TooltipPositionVariant;
  children: ReactElement;
  Content: ReactElement;
  clickableTooltip?: boolean;
  disabledFocus?: boolean;
  disabledHover?: boolean;
  disabledTouch?: boolean;
  disabledClick?: boolean;
  followCursor?: boolean;
  zIndex?: number;
  margin?: number;
}

export const Tooltip = (props: TooltipProps) => {
  const {
    className,
    position: tooltipPosition = "top",
    children,
    Content,
    clickableTooltip,
    disabledFocus,
    disabledHover,
    disabledTouch,
    disabledClick = true,
    followCursor,
    zIndex = Z_INDEX.TOOLTIP,
    margin = 10,
  } = props;

  const [isVisible, setIsVisible] = useState<boolean>(
    false
  );
  const [isUnmountingAnimation, setIsUnmountingAnimation] =
    useState<boolean>(false);

  const parentRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const unmountingTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const isTouchDeviceRef = useRef<boolean>(false)

  const tooltipId = useId();

  const handleOpen = () => {
    if (unmountingTimeoutIdRef.current) {
      clearTimeout(unmountingTimeoutIdRef.current);
      setIsUnmountingAnimation(false);
    }
    setIsVisible(true);
  };

  const handleClose = useCallback(() => {
    setIsUnmountingAnimation(true);
    unmountingTimeoutIdRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200);
  }, []);

  const handleTouchStart = () => {
    if (disabledTouch) return;

    if (autoCloseTimeoutIdRef.current) {
      clearTimeout(autoCloseTimeoutIdRef.current);
    }
    touchTimeoutIdRef.current = setTimeout(() => {
      handleOpen();
    }, 500);
  };

  const handleTouchEnd = () => {
    if (disabledTouch) return;

    if (touchTimeoutIdRef.current) {
      clearTimeout(touchTimeoutIdRef.current);
    }
    autoCloseTimeoutIdRef.current = setTimeout(() => {
      handleClose();
    }, 2000);
  };

  // For following cursor mod
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    throttleHandleChangePositionWithFollowCursor(tooltip, event);
  }, []);

  const handleMouseEnter = () => {
    if (isTouchDeviceRef.current || disabledHover) return;
    if (followCursor) document.addEventListener("mousemove", handleMouseMove);
    handleOpen();
  };

  const handleMouseLeave = () => {
    if (isTouchDeviceRef.current || disabledHover) return;
    if (followCursor)
      document.removeEventListener("mousemove", handleMouseMove);
    handleClose();
  };

  const handleFocus = () => {
    if (!disabledFocus && !isTouchDeviceRef.current) handleOpen();
  };

  const handleBlur = () => {
    if (!disabledFocus && !isTouchDeviceRef.current) handleClose();
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const tooltip = tooltipRef.current;
      const parent = parentRef.current;

      if (!tooltip || !parent) return;

      if (
        !parent.contains(event.target as Node) &&
        !tooltip.contains(event.target as Node) &&
        clickableTooltip
      ) {
        handleClose();
      }
    },
    [clickableTooltip, handleClose]
  );

  useEffect(() => {
    if (isVisible && !disabledClick) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [disabledClick, handleClickOutside, isVisible]);

  useEffect(() => {
    if ("ontouchstart" in window) {
      isTouchDeviceRef.current = true
    } else {
      isTouchDeviceRef.current = false
    }
  }, []);

  // Remove
  useEffect(() => {
    return () => {
      if (unmountingTimeoutIdRef.current)
        clearTimeout(unmountingTimeoutIdRef.current);
      if (autoCloseTimeoutIdRef.current) {
        clearTimeout(autoCloseTimeoutIdRef.current);
      }
      if (touchTimeoutIdRef.current) {
        clearTimeout(touchTimeoutIdRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove, handleClickOutside]);

  const localHandleChangePosition = useCallback(() => {
    const parent = parentRef.current;
    const tooltip = tooltipRef.current;

    if (!parent || !tooltip) return;

    handleChangePosition(tooltip, parent, tooltipPosition, margin);
  }, [tooltipPosition, margin]);

  useEffect(() => {
    if (!isVisible || (followCursor && !isTouchDeviceRef.current)) return;

    const parent = parentRef.current;
    const tooltip = tooltipRef.current;

    if (!parent || !tooltip) return;

    const throttledHandleChanges = throttle(localHandleChangePosition, 1000);

    const resizeObserver = new ResizeObserver(throttledHandleChanges);

    resizeObserver.observe(tooltip);
    resizeObserver.observe(parent);

    window.addEventListener("resize", throttledHandleChanges);
    window.addEventListener("scroll", throttledHandleChanges);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", throttledHandleChanges);
      window.removeEventListener("scroll", throttledHandleChanges);
      throttledHandleChanges.cancel();
    };
  }, [isVisible, localHandleChangePosition, followCursor, isTouchDeviceRef]);

  const triggerElementProps = {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseEnter: handleMouseEnter,
    onTouchStart: handleTouchStart, 
    onTouchEnd: handleTouchEnd,
    onClick: !disabledClick ? handleOpen : undefined,
    onMouseLeave: !clickableTooltip ? handleMouseLeave : undefined,
    ref: parentRef,
    "aria-labelledby": isVisible ? tooltipId : undefined,
  };

  const mods: Record<string, boolean> = {
    [styles["unmounting"]]: isUnmountingAnimation,
  };

  return (
    <div
      className={classNames(styles["container"], [className])}
      onMouseLeave={clickableTooltip ? handleMouseLeave : undefined}
    >
      {cloneElement(children, { ...triggerElementProps })}
      {isVisible && (
        <Portal>
          <div
            ref={tooltipRef}
            className={classNames(
              styles["tooltip-wrapper"],
              [styles[tooltipPosition]],
              mods
            )}
            style={{
              zIndex,
              padding: margin,
              pointerEvents: followCursor ? "none" : undefined,
            }}
          >
            <div role="tooltip" id={tooltipId} className={styles["tooltip"]}>
              {Content}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

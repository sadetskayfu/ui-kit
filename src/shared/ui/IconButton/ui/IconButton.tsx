import {
  ButtonHTMLAttributes,
  forwardRef,
  LinkHTMLAttributes,
  ReactNode,
  useRef,
} from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import {
  handleRipple,
  handleRippleMousePosition,
} from "@/shared/lib/handleRipple/handleRipple";
import { RippleWrapper } from "@/shared/ui/RippleWrapper";
import { Link } from "react-router-dom";
import styles from "./style.module.scss";

type IconButtonVariant = "filled" | "outlined" | "clear";
type IconButtonColor = "primary" | "dark" | "grey" | "custom-color";
type IconButtonSize =
  | "small-s"
  | "small-m"
  | "small-l"
  | "medium"
  | "large"
  | "custom-size";

type IconButtonBorderRadius =
  | "rounded-left"
  | "rounded-right"
  | "rounded"
  | "circular"
  | "square";

type LinkProps = Omit<
  LinkHTMLAttributes<HTMLAnchorElement>,
  | "href"
  | "tabIndex"
  | "onKeyDown"
  | "onMouseDown"
  | "onClick"
  | "aria-readonly"
>;
type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "disabled"
  | "type"
  | "tabIndex"
  | "onClick"
  | "onKeyDown"
  | "onMouseDown"
  | "aria-readonly"
>;

interface IconButtonProps {
  className?: string;
  id?: string;
  variant?: IconButtonVariant;
  color?: IconButtonColor;
  size?: IconButtonSize;
  borderRadius?: IconButtonBorderRadius;
  disabled?: boolean;
  stopFocus?: boolean;
  isLink?: boolean;
  isExternalLink?: boolean;
  to?: string;
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: () => void;
  onMouseDown?: () => void;
  linkProps?: LinkProps;
  buttonProps?: ButtonProps;
}

export const IconButton = forwardRef(
  (
    props: IconButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement | null>
  ) => {
    const {
      children,
      id,
      className,
      disabled,
      stopFocus,
      isLink,
      isExternalLink,
      to = "",
      variant = "filled",
      size = "medium",
      color = "primary",
      borderRadius = "circular",
      type = "button",
      tabIndex,
      onClick,
      onKeyDown,
      onMouseDown,
      linkProps,
      buttonProps,
      ...otherProps
    } = props;

    const rippleWrapperRef = useRef<HTMLSpanElement | null>(null);
    const localLinkRef = useRef<HTMLAnchorElement | null>(null);
    const linkRef = ref
      ? (ref as React.RefObject<HTMLAnchorElement>)
      : localLinkRef;

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();

        if (isLink || isExternalLink) {
          linkRef.current?.click();
        } else {
          onClick?.();
        }
        handleRipple(rippleWrapperRef);
      }
      onKeyDown?.();
    };

    const handleMouseDown = (event: React.MouseEvent) => {
      if (stopFocus) {
        event.preventDefault();
      }
      onMouseDown?.();
    };

    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      onClick?.();
      handleRippleMousePosition(rippleWrapperRef, event);
    };

    const additionalClasses: Array<string | undefined> = [
      styles[variant],
      styles[color],
      styles[size],
      styles[borderRadius],
      className,
    ];

    const mods: Record<string, boolean | undefined> = {
      [styles["disabled"]]: disabled,
    };

    const localTabIndex = disabled ? -1 : tabIndex;

    if (isLink) {
      return (
        <Link
          className={classNames(styles["button"], additionalClasses, mods)}
          id={id}
          to={to}
          tabIndex={localTabIndex}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          ref={linkRef}
          {...linkProps}
          {...otherProps}
        >
          {children}
          <RippleWrapper ref={rippleWrapperRef} />
        </Link>
      );
    }

    if (isExternalLink) {
      return (
        <a
          className={classNames(styles["button"], additionalClasses, mods)}
          id={id}
          href={to}
          tabIndex={localTabIndex}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          ref={linkRef}
          {...linkProps}
          {...otherProps}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        className={classNames(styles["button"], additionalClasses, mods)}
        id={id}
        type={type}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        tabIndex={localTabIndex}
        disabled={disabled}
        ref={ref && (ref as React.ForwardedRef<HTMLButtonElement>)}
        {...buttonProps}
        {...otherProps}
      >
        {children}
        <RippleWrapper ref={rippleWrapperRef} />
      </button>
    );
  }
);

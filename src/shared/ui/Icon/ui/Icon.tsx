import { classNames } from "@/shared/lib/classNames/classNames";
import { lazy, Suspense } from "react";
import styles from "./style.module.scss";

const Arrow = lazy(() => import("@/shared/assets/icons/arrow.svg"));
const CheckMark = lazy(
  () => import("@/shared/assets/icons/check-mark.svg")
);
const Cart = lazy(() => import("@/shared/assets/icons/cart.svg"));
const Envelope = lazy(() => import("@/shared/assets/icons/envelope.svg"));
const Eye = lazy(() => import("@/shared/assets/icons/eye.svg"));
const EyeSlash = lazy(() => import("@/shared/assets/icons/eye-slash.svg"));
const Bell = lazy(() => import("@/shared/assets/icons/bell.svg"));
const BookMark = lazy(() => import("@/shared/assets/icons/book-mark.svg"));
const ThumbsUp = lazy(() => import("@/shared/assets/icons/thumbs-up.svg"));
const Trash = lazy(() => import("@/shared/assets/icons/trash.svg"));
const User = lazy(() => import("@/shared/assets/icons/user.svg"));
const XMark = lazy(() => import("@/shared/assets/icons/x-mark.svg"));
const Gear = lazy(() => import("@/shared/assets/icons/gear.svg"));
const Heart = lazy(() => import("@/shared/assets/icons/heart.svg"));
const House = lazy(() => import("@/shared/assets/icons/house.svg"));
const Search = lazy(() => import("@/shared/assets/icons/search.svg"));
const Plus = lazy(() => import("@/shared/assets/icons/plus.svg"));
const Minus = lazy(() => import("@/shared/assets/icons/minus.svg"));

export type IconVariant = "arrow" | "check-mark" | "cart" | "envelope" | "eye" | "eye-slash" | "bell" | "book-mark" | "thumbs-up" | "trash" | "user" | "x-mark" | "gear" | "heart" | "house" | "search" | "plus" | "minus";
export type IconSize = "small-xx" | "small-x" | "small" | "medium" | "large" | "inherit";

export interface IconProps {
  className?: string;
  variant: IconVariant;
  size?: IconSize;
  fontSize?: string;
}

export const Icon = (props: IconProps) => {
  const {
    className,
    variant,
    size = "inherit",
    fontSize,
  } = props;

  const additionalClasses: Array<string | undefined> = [
    className,
    styles[size],
  ];

  return (
    <Suspense>
      <span className={classNames(styles["icon"], additionalClasses)} style={{fontSize}}>
        {variant === "arrow" && <Arrow />}
        {variant === "check-mark" && <CheckMark />}
        {variant === "cart" && <Cart />}
        {variant === "envelope" && <Envelope />}
        {variant === "eye" && <Eye />}
        {variant === "eye-slash" && <EyeSlash />}
        {variant === "bell" && <Bell />}
        {variant === "book-mark" && <BookMark />}
        {variant === "thumbs-up" && <ThumbsUp />}
        {variant === "trash" && <Trash />}
        {variant === "user" && <User />}
        {variant === "x-mark" && <XMark />}
        {variant === "gear" && <Gear />}
        {variant === "heart" && <Heart />}
        {variant === "house" && <House />}
        {variant === "search" && <Search />}
        {variant === "plus" && <Plus />}
        {variant === "minus" && <Minus />}
      </span>
    </Suspense>
  );
};

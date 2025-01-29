import { ReactElement } from "react";
import { classNames } from "@/shared/helpers/classNames";
import styles from "./style.module.scss";

type BadgePosition = "top-left" | "top-right" | "bottom-right" | "bottom-left";
type BadgeColor = "primary" | "secondary" | "green" | "red";
type BadgeOverlap = 'circular' | 'square'
type BadgeSize = 'small' | 'medium'

interface BadgeProps {
  className?: string;
  children: ReactElement;
  position?: BadgePosition;
  color?: BadgeColor;
  size?: BadgeSize;
  badgeContent?: number | string;
  max?: number;
  overlap?: BadgeOverlap;
  isBorder?: boolean;
  isVisible?: boolean
}

const getBadgeContent = (value: number | undefined, maxValue: number) => {
  if (!value) return 0;

  let newValue: string | number = 0;

  if (value > maxValue) {
    newValue = maxValue + "+";
  } else {
    newValue = value;
  }

  return newValue;
};

export const Badge = (props: BadgeProps) => {
  const {
    children,
    position = "top-right",
    color = "primary",
    overlap = 'circular',
    size = 'medium',
    isBorder,
    badgeContent,
    max,
    className,
    isVisible,
  } = props;

  const additionalClasses: Array<string | undefined> = [
    styles[position],
    styles[color],
    styles[overlap],
    styles[size],
  ];

  const badgeContentIsNumber = typeof badgeContent === 'number'

  const content = max && badgeContentIsNumber ? getBadgeContent(badgeContent, max) : badgeContent;

  const mods: Record<string, boolean | undefined> = {
    [styles["visible"]]: isVisible ? isVisible : (badgeContentIsNumber ? badgeContent > 0 : undefined),
    [styles['border']]: isBorder,
  };

  return (
    <div className={classNames(styles["container"], [className])}>
      {children}
      <span className={classNames(styles["badge"], additionalClasses, mods)}>{content}</span>
    </div>
  );
};

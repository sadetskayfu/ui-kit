import { ReactElement } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import styles from "./style.module.scss";

type BadgePosition = "top-left" | "top-right" | "bottom-right" | "bottom-left";
type BadgeColor = "primary" | "green";
type BadgeOverlap = 'circular' | 'square'
type BadgeSize = 'small' | 'medium'

interface BadgeProps {
  className?: string;
  children: ReactElement;
  position?: BadgePosition;
  color?: BadgeColor;
  size?: BadgeSize;
  badgeContent?: number | string | ReactElement;
  max?: number;
  overlap?: BadgeOverlap;
  border?: boolean;
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
    border,
    badgeContent,
    max,
    className,
    isVisible,
  } = props;

  const additionalClasses: Array<string | undefined> = [
    className,
    styles[position],
    styles[color],
    styles[overlap],
    styles[size],
  ];

  const badgeContentIsNumber = typeof badgeContent === 'number'

  const content = max && badgeContentIsNumber ? getBadgeContent(badgeContent, max) : badgeContent;

  const mods: Record<string, boolean | undefined> = {
    [styles["visible"]]: isVisible ? isVisible : (badgeContentIsNumber ? badgeContent > 0 : undefined),
    [styles['border']]: border,
  };

  return (
    <div className={classNames(styles["container"], additionalClasses, mods)}>
      {children}
      <span className={styles["badge"]}>{content}</span>
    </div>
  );
};

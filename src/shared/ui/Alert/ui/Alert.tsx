import { Children, cloneElement, ReactElement } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import styles from "./style.module.scss";

type AlertVariant = "filled" | "outlined" | "clear";
type AlertSeverity = "success" | "info" | "warning" | "error";
type AlertBorderRadius = "small" | "none";

interface AlertProps {
  className?: string;
  Action?: ReactElement | ReactElement[];
  Icon?: ReactElement;
  children: string;
  title?: string;
  variant?: AlertVariant;
  severity?: AlertSeverity;
  borderRadius?: AlertBorderRadius;
}

export const Alert = (props: AlertProps) => {
  const {
    Action,
    Icon,
    children,
    title,
    variant = "filled",
    severity = "info",
    borderRadius = 'small',
    className,
  } = props;

  const additionalClasses: Array<string | undefined> = [
    className,
    styles[variant],
    styles[severity],
    styles[borderRadius],
  ];

  const mods: Record<string, boolean | undefined> = {
    [styles['have-action']]: !!Action
  }

  return (
    <div
      role="alert"
      className={classNames(styles["alert"], additionalClasses, mods)}
    >
      {Icon}
      <div className={styles["content"]}>
        {title && <span className={styles["title"]}>{title}</span>}
        <p className={styles["message"]}>{children}</p>
      </div>
      {Action && (
        <div className={styles['actions']}>
          {Children.map(Action, (child) => {
            return cloneElement(child);
          })}
        </div>
      )}
    </div>
  );
};

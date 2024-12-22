import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import styles from "./style.module.scss";

type DividerOrientation = "horizontal" | "vertical";
type DividerComponent = "li" | "hr";

interface DividerProps {
  className?: string;
  orientation?: DividerOrientation;
  component?: DividerComponent;
}

export const Divider = memo((props: DividerProps) => {
  const { orientation = "vertical", component, className } = props;

  const additionalClasses: Array<string | undefined> = [
    styles[orientation],
    className,
  ];

  switch (component) {
    case "hr":
      return (
        <hr
          className={classNames(styles["divider"], additionalClasses)}
          role="separator"
          aria-orientation={orientation}
        ></hr>
      );
    case "li":
      return (
        <li
          className={classNames(styles["divider"], additionalClasses)}
          role="separator"
          aria-orientation={orientation}
        ></li>
      );
    default:
      return (
        <div
          className={classNames(styles["divider"], additionalClasses)}
          role="separator"
          aria-orientation={orientation}
        ></div>
      );
  }
});

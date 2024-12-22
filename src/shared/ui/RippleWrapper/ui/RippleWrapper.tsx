import { forwardRef } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import styles from "./style.module.scss";

interface RippleWrapperProps {
  className?: string;
}

export const RippleWrapper = forwardRef(
  (
    props: RippleWrapperProps,
    ref: React.ForwardedRef<HTMLSpanElement | null>
  ) => {
    const { className } = props;

    return (
      <span
        ref={ref}
        className={classNames(styles["wrapper"], [className])}
      ></span>
    );
  }
);

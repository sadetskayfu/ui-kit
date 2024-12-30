import { Children, cloneElement, ReactElement, useId } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import styles from "./style.module.scss";

type FormGroupSize = "medium";
type FormGroupOrientation = "horizontal" | "vertical";

interface FormGroupProps {
  className?: string;
  children: ReactElement[];
  label: string;
  errorMessage?: string;
  tabIndex?: number;
  size?: FormGroupSize;
  orientation?: FormGroupOrientation;
  required?: boolean;
  hiddenLegend?: boolean;
}

export const FormGroup = (props: FormGroupProps) => {
  const {
    className,
    children,
    label,
    errorMessage,
    tabIndex,
    size = "medium",
    orientation = "horizontal",
    required,
    hiddenLegend,
  } = props;

  const errorMessageId = useId();

  const renderChildren = () => {
    return Children.map(children, (child: ReactElement) => {
      return cloneElement(child, { tabIndex, size });
    });
  };

  const additionalClasses: Array<string | undefined> = [
    className,
    styles[size],
    styles[orientation],
  ];

  const mods: Record<string, boolean | undefined> = {
    [styles["errored"]]: !!errorMessage,
    [styles["required"]]: required,
    [styles["hidden-legend"]]: hiddenLegend,
  };

  return (
    <fieldset
      className={classNames(styles["form-group"], additionalClasses, mods)}
      aria-required={required ? "true" : undefined}
      aria-errormessage={errorMessage ? errorMessageId : undefined}
    >
      <legend className={styles["legend"]}>{label}</legend>
      <div className={styles["items"]}>{renderChildren()}</div>
      {errorMessage && (
        <p id={errorMessageId} className={styles["error-message"]}>{errorMessage}</p>
      )}
    </fieldset>
  );
};

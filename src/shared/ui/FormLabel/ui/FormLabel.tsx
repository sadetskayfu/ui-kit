import { cloneElement, ReactElement, useId } from "react";
import { classNames } from "@/shared/helpers/classNames";
import styles from "./style.module.scss";

type LabelPosition = 'right' | 'left' | 'top' | 'bottom'

interface FormLabelProps {
  Component: ReactElement;
  label: string;
  required?: boolean
  disabled?: boolean
  labelPosition?: LabelPosition
}

export const FormLabel = (props: FormLabelProps) => {
  const { Component, label, required, disabled, labelPosition = 'right', ...otherProps} = props;

  const labelId = useId();

  const additionalClasses: Array<string> = [
    styles[labelPosition],
  ]

  const mods: Record<string, boolean | undefined> = {
    [styles['required']]: required,
    [styles['disabled']]: disabled
  }

  return (
    <label className={classNames(styles['label-wrapper'], additionalClasses, mods)} {...otherProps}>
      {cloneElement(Component, { labelId, required, disabled })}
      <span className={styles['label']} id={labelId}>
        {label}
      </span>
    </label>
  );
};

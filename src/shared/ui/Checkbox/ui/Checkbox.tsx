import { classNames } from "@/shared/lib/classNames/classNames";
import { handleRipple } from "@/shared/lib/handleRipple/handleRipple";
import {
  cloneElement,
  InputHTMLAttributes,
  memo,
  ReactElement,
  useRef,
} from "react";
import { RippleWrapper } from "@/shared/ui/RippleWrapper";
import { Icon as Checkmark, IconProps } from "@/shared/ui/Icon";
import styles from "./style.module.scss";

type CheckboxVariant = "filled" | "outlined" | "clear";
type CheckboxSize = "medium";
type CheckboxColor = "primary" | "red";

interface BaseCheckboxProps {
  className?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  color?: CheckboxColor;
  name?: string;
  labelId?: string;
  required?: boolean;
  disabled?: boolean;
  checked: boolean;
  onChange: (checked: boolean, name: string) => void;
  tabIndex?: number;
  Icon?: ReactElement<IconProps>;
  CheckedIcon?: ReactElement<IconProps>;
}

type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  keyof BaseCheckboxProps
>;

interface CheckboxProps extends BaseCheckboxProps {
  inputProps?: HTMLInputProps
}

export const Checkbox = memo((props: CheckboxProps) => {
  const {
    className,
    size = "medium",
    variant = "filled",
    color = "primary",
    name,
    labelId,
    disabled,
    required,
    checked,
    onChange,
    tabIndex = 0,
    Icon,
    CheckedIcon,
    inputProps,
  } = props;

  const rippleWrapperRef = useRef<HTMLSpanElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked, event.target.name);
    handleRipple(rippleWrapperRef, true);
  };

  const additionalClasses: Array<string | undefined> = [
    className,
    styles[size],
    styles[variant],
    styles[color],
  ];

  const mods: Record<string, boolean | undefined> = {
    [styles["checked"]]: checked,
    [styles["required"]]: required,
    [styles["disabled"]]: disabled,
  };

  const localTabIndex = disabled ? -1 : tabIndex;

  return (
    <label
      className={classNames(
        styles["checkbox-wrapper"],
        additionalClasses,
        mods
      )}
    >
      <input
        className={styles["input"]}
        type="checkbox"
        value={name}
        name={name}
        onChange={handleChange}
        tabIndex={localTabIndex}
        disabled={disabled}
        required={required}
        checked={checked}
        aria-labelledby={labelId ? labelId : undefined}
        {...inputProps}
      />
      <div className={styles["checkbox"]}>
        {Icon && cloneElement(Icon, { className: styles["icon"] })}
        {CheckedIcon ? (
          cloneElement(CheckedIcon, { className: styles["checked-icon"] })
        ) : (
          <Checkmark className={styles['checked-icon']} variant="check-mark"/>
        )}
        <RippleWrapper ref={rippleWrapperRef} />
      </div>
    </label>
  );
});

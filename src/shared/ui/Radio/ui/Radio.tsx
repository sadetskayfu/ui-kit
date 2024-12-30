import { InputHTMLAttributes, memo, useRef } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { handleRipple } from "@/shared/lib/handleRipple/handleRipple";
import { RippleWrapper } from "@/shared/ui/RippleWrapper";
import styles from "./style.module.scss";

type RadioSize = "medium"
type RadioVariant = "filled" | "outlined"

interface BaseRadioProps {
  className?: string;
  size?: RadioSize;
  variant?: RadioVariant
  name: string;
  labelId?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
  selectedValue: string;
  tabIndex?: number;
}

type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  keyof BaseRadioProps
>;

interface RadioProps extends BaseRadioProps {
  inputProps?: HTMLInputProps;
}

export const Radio = memo((props: RadioProps) => {
  const {
    className,
    size = "medium",
    variant = 'filled',
    name,
    value,
    selectedValue,
    labelId,
    disabled,
    onChange,
    tabIndex = 0,
    inputProps,
  } = props;

  const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

  const isChecked = value === selectedValue
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    handleRipple(rippleWrapperRef, true);
  };

  const additionalClasses: Array<string | undefined> = [
    className,
    styles[size],
    styles[variant],
  ];

  const mods: Record<string, boolean | undefined> = {
    [styles['disabled']]: disabled,
    [styles['checked']]: isChecked
  }

  const localTabIndex = disabled ? -1 : tabIndex

  return (
    <label
      className={classNames(styles["radio-wrapper"], additionalClasses, mods)}
      
    >
      <input
        className={styles["input"]}
        type="radio"
        name={name}
        value={value}
        onChange={handleChange}
        checked={isChecked}
        tabIndex={localTabIndex}
        disabled={disabled}
        aria-labelledby={labelId ? labelId : undefined}
        {...inputProps}
      />
      <div className={styles["radio"]}>
          <span className={styles['emulator']}></span>
          <RippleWrapper ref={rippleWrapperRef}/>
      </div>
    </label>
  );
});

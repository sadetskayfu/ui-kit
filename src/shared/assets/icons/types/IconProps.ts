type IconSize = "small-xx" | "small-x" | "small" | "medium" | "large" | "inherit";
type IconColor = 'primary' | 'inherit'

export interface IconProps {
    className?: string
    size?: IconSize
    color?: IconColor
}
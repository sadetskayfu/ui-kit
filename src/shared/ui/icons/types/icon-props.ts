type IconSize = "s" | "m" | "l" | "inherit";
type IconColor = 'primary' | 'inherit'

export interface IconProps {
    className?: string
    size?: IconSize
    color?: IconColor
}
import { ImgHTMLAttributes, memo, ReactElement, useState } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import styles from './style.module.scss'

type AvatarVariant = 'circular' | 'rounded' | 'square'
type AvatarSize = 'small' | 'medium' | 'large'
type AvatarBorderColor = 'dark' | 'grey' | "none"

type HTMLImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'>

export interface AvatarProps {
	className?: string
	size?: AvatarSize
	children?: ReactElement | string
	src?: string
	alt?: string
	variant?: AvatarVariant
	border?: AvatarBorderColor
	imgProps?: HTMLImgProps
	bgColor?: string
	height?: string
	width?: string
	defaultBgColor?: boolean
}

const getFirstLetter = (str: string | undefined) => {
	if (!str) return 'U'
	return str.charAt(0)
}

export const Avatar = memo((props: AvatarProps) => {
	const {
		className,
		size = 'small',
		children,
		src,
		alt,
		variant = 'circular',
		border = 'none',
		bgColor,
		imgProps,
		height,
		width,
		defaultBgColor = true,
	} = props

	const [imageError, setImageError] = useState(false)

	const isEmptySrc = !src || src.trim() === ''

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
		styles[size],
		styles[border],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['default-bg-color']]: defaultBgColor,
	}

	const content = children ? children : getFirstLetter(alt)

	return (
		<div
			style={{ backgroundColor: bgColor, height, width }}
			className={classNames(styles['avatar'], additionalClasses, mods)}
		>
			{imageError || isEmptySrc ? (
				content
			) : (
				<img
					src={src}
					alt={alt}
					onError={() => setImageError(true)}
					className={styles['img']}
					{...imgProps}
				/>
			)}
		</div>
	)
})

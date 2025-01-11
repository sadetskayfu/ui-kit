import { ImgHTMLAttributes, memo, ReactElement, useState } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { getFirstLetter } from '@/shared/lib/formattingString'
import styles from './style.module.scss'

type AvatarVariant = 'circular' | 'rounded' | 'square'
type AvatarSize = 'small' | 'medium' | 'large'
type AvatarBorderColor = 'dark' | 'primary' | "none"

interface BaseAvatarProps {
	className?: string
	size?: AvatarSize
	children?: ReactElement | string
	src?: string
	alt?: string
	variant?: AvatarVariant
	border?: AvatarBorderColor
	bgColor?: string
	height?: string
	width?: string
	defaultBgColor?: boolean
}

type HTMLImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, keyof BaseAvatarProps>

export interface AvatarProps extends BaseAvatarProps {
	imgProps?: HTMLImgProps
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

	const reserveContent = children ? children : getFirstLetter(alt)

	return (
		<div
			style={{ backgroundColor: bgColor, height, width }}
			className={classNames(styles['avatar'], additionalClasses, mods)}
		>
			{imageError || isEmptySrc ? (
				reserveContent
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

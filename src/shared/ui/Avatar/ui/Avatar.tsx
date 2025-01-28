import { ImgHTMLAttributes, memo, ReactElement, useState } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { getFirstLetter } from '@/shared/helpers/formattingString'
import styles from './style.module.scss'

type AvatarVariant = 'circular' | 'rounded' | 'square'
type AvatarSize = 'small' | 'medium' | 'large' | 'custom'
type AvatarBorderColor = 'dark' | 'primary' | 'none'

interface BaseAvatarProps {
	className?: string
	size?: AvatarSize
	children?: ReactElement | string
	src?: string
	alt?: string
	variant?: AvatarVariant
	border?: AvatarBorderColor
	defaultBgColor?: boolean
	style?: React.CSSProperties
}

type HTMLImgProps = Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	keyof BaseAvatarProps
>

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
		style,
		defaultBgColor = true,
		imgProps,
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
			style={{ ...style }}
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

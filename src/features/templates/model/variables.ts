export const colorPrimaryVariables: string[] = [
    '--primary-hue',
	'--primary-saturation',
	'--primary-lightness',
	'--color-primary-800',
	'--color-primary-600',
	'--color-primary-500',
	'--color-primary-300',
]

export const colorGreyVariables: string[] = [
    '--grey-hue',
	'--grey-saturation',
	'--grey-lightness',
	'--color-grey-900',
	'--color-grey-800',
	'--color-grey-600',
	'--color-grey-500',
	'--color-grey-300',
	'--color-grey-200',
]

export const colorRedVariables: string[] = [
	'--red-hue',
	'--red-saturation',
	'--red-lightness',
	'--color-red-800',
	'--color-red-600',
	'--color-red-500',
	'--color-red-300',
];

export const colorGreenVariables: string[] = [
    '--green-hue',
	'--green-saturation',
	'--green-lightness',
	'--color-green-800',
	'--color-green-600',
	'--color-green-500',
	'--color-green-300',
]

export const borderRadiusVariables: string[] = [
    '--border-radius-s',
    '--border-radius-m',
]

export const variables: string[] = [
    '--color-dark',
    '--color-light',
    ...colorPrimaryVariables,
    ...colorGreyVariables,
    ...colorRedVariables,
    ...colorGreenVariables,
    ...borderRadiusVariables,
];

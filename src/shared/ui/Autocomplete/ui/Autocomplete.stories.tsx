import { Meta, StoryObj } from '@storybook/react'
import { Autocomplete, Option } from './Autocomplete'
import { OptionItem } from '@/shared/ui/OptionItem'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Chip } from '@/shared/ui/Chip'
import { TextField } from '@/shared/ui/TextField'
import { Location } from '@/shared/assets/icons'
import { CircularProgress } from '@/shared/ui/CircularProgress'

const movies = [
	{ value: 'inception', label: 'Начало' },
	{ value: 'the_dark_knight', label: 'Темный рыцарь' },
	{ value: 'interstellar', label: 'Интерстеллар' },
	{ value: 'fight_club', label: 'Бойцовский клуб' },
	{ value: 'pulp_fiction', label: 'Криминальное чтиво' },
	{ value: 'the_matrix', label: 'Матрица' },
	{ value: 'forrest_gump', label: 'Форрест Гамп' },
	{ value: 'the_godfather', label: 'Крёстный отец' },
	{ value: 'the_shawshank_redemption', label: 'Побег из Шоушенка' },
	{ value: 'gladiator', label: 'Гладиатор' },
	{ value: 'the_lion_king', label: 'Король Лев' },
	{ value: 'schindlers_list', label: 'Список Шиндлера' },
	{ value: 'the_silence_of_the_lambs', label: 'Молчание ягнят' },
	{ value: 'saving_private_ryan', label: 'Спасти рядового Райана' },
	{ value: 'the_social_network', label: 'Социальная сеть' },
	{ value: 'the_pursuit_of_happyness', label: 'В погоне за счастьем' },
	{ value: 'the_usual_suspects', label: 'Обычные подозреваемые' },
	{ value: 'se7en', label: 'Семь' },
	{ value: 'the_departed', label: 'Отступники' },
	{ value: 'whiplash', label: 'Одержимость' },
	{ value: 'the_grand_budapest_hotel', label: 'Отель «Гранд Будапешт»' },
	{ value: 'mad_max_fury_road', label: 'Безумный Макс: Дорога ярости' },
	{ value: 'the_revenant', label: 'Выживший' },
	{ value: 'la_la_land', label: 'Ла-Ла Ленд' },
	{ value: 'get_out', label: 'Побег' },
	{ value: 'joker', label: 'Джокер' },
	{ value: 'parasite', label: 'Паразиты' },
	{ value: '1917', label: '1917' },
	{ value: 'the_shape_of_water', label: 'Форма воды' },
	{ value: 'black_panther', label: 'Черная пантера' },
	{
		value: 'spider_man_into_the_spider_verse',
		label: 'Человек-паук: Через вселенные',
	},
	{ value: 'the_father', label: 'Отец' },
	{ value: 'dunkirk', label: 'Дюнкерк' },
	{ value: 'the_martian', label: 'Марсианин' },
	{ value: 'the_intouchables', label: '1+1' },
	{
		value: 'the_lord_of_the_rings_the_return_of_the_king',
		label: 'Властелин колец: Возвращение короля',
	},
	{
		value: 'the_lord_of_the_rings_the_fellowship_of_the_ring',
		label: 'Властелин колец: Братство кольца',
	},
	{
		value: 'the_lord_of_the_rings_the_two_towers',
		label: 'Властелин колец: Две крепости',
	},
	{ value: 'the_hateful_eight', label: 'Омерзительная восьмерка' },
	{ value: 'the_bright_side', label: 'Сияние' },
	{ value: 'the_king_s_speech', label: 'Король говорит!' },
	{ value: 'the_terminator', label: 'Терминатор' },
	{ value: 'back_to_the_future', label: 'Назад в будущее' },
	{ value: 'the_exorcist', label: 'Изгоняющий дьявола' },
	{ value: 'the_wolf_of_wall_street', label: 'Волк с Уолл-стрит' },
	{ value: 'the_bourne_identity', label: 'Идентификация Борна' },
	{ value: 'the_bourne_supremacy', label: 'Ультиматум Борна' },
	{ value: 'the_bourne_legacy', label: 'Наследие Борна' },
	{ value: 'the_bourne_ultimatum', label: 'Идентификация Борна' },
	{ value: 'the_incredibles', label: 'Суперсемейка' },
	{ value: 'finding_nemo', label: 'В поисках Немо' },
	{ value: 'toy_story', label: 'История игрушек' },
	{ value: 'shrek', label: 'Шрек' },
	{ value: 'zootopia', label: 'Зверополис' },
	{ value: 'inside_out', label: 'Головоломка' },
	{ value: 'coco', label: 'Коко' },
	{ value: 'ratatouille', label: 'Рататуй' },
	{ value: 'monsters_inc', label: 'Корпорация монстров' },
	{ value: 'the_incredibles_2', label: 'Суперсемейка 2' },
	{ value: 'frozen', label: 'Холодное сердце' },
	{ value: 'frozen_ii', label: 'Холодное сердце 2' },
	{ value: 'the_secret_life_of_pets', label: 'Тайная жизнь домашних животных' },
	{
		value: 'the_secret_life_of_pets_2',
		label: 'Тайная жизнь домашних животных 2',
	},
	{ value: 'minions', label: 'Миньоны' },
	{ value: 'despicable_me', label: 'Гадкий я' },
	{ value: 'despicable_me_2', label: 'Гадкий я 2' },
	{ value: 'despicable_me_3', label: 'Гадкий я 3' },
	{ value: 'the_grinch', label: 'Гринч' },
	{ value: 'how_to_train_your_dragon', label: 'Как приручить дракона' },
	{ value: 'how_to_train_your_dragon_2', label: 'Как приручить дракона 2' },
	{ value: 'how_to_train_your_dragon_3', label: 'Как приручить дракона 3' },
	{ value: 'the_addams_family', label: 'Семейка Аддамс' },
	{ value: 'the_addams_family_2', label: 'Семейка Аддамс 2' },
	{ value: 'the_spongeBob_movie', label: 'Губка Боб в бегах' },
	{
		value: 'the_spongeBob_movie_sponge_on_the_run',
		label: 'Губка Боб: Спанч Боб в бегах',
	},
	{ value: 'the_little_mermaid', label: 'Русалочка' },
	{ value: 'aladdin', label: 'Аладдин' },
	{ value: 'beauty_and_the_beast', label: 'Красавица и чудовище' },
	{ value: 'mulan', label: 'Мулан' },
	{ value: 'peter_pan', label: 'Питер Пэн' },
	{ value: 'the_hunchback_of_notre_dame', label: 'Собор Парижской Богоматери' },
	{ value: 'the_fox_and_the_hound', label: 'Лис и собака' },
	{ value: 'the_rescuers', label: 'Спасатели' },
	{ value: 'the_rescuers_down_under', label: 'Спасатели: В поисках сокровищ' },
	{ value: 'the_road_to_el_dorado', label: 'Путь к Эльдорадо' },
	{ value: 'the_princess_and_the_frog', label: 'Принцесса и лягушка' },
	{ value: 'tangled', label: 'Рапунцель: Запутанная история' },
	{ value: 'the_emoji_movie', label: 'Эмоджи-муви' },
	{ value: 'the_emoji_movie_2', label: 'Эмоджи-муви 2' },
	{ value: 'the_emoji_movie_3', label: 'Эмоджи-муви 3' },
	{ value: 'the_emoji_movie_4', label: 'Эмоджи-муви 4' },
	{ value: 'the_emoji_movie_5', label: 'Эмоджи-муви 5' },
	{ value: 'the_emoji_movie_6', label: 'Эмоджи-муви 6' },
	{ value: 'the_emoji_movie_7', label: 'Эмоджи-муви 7' },
	{ value: 'the_emoji_movie_8', label: 'Эмоджи-муви 8' },
	{ value: 'the_emoji_movie_9', label: 'Эмоджи-муви 9' },
	{ value: 'the_emoji_movie_10', label: 'Эмоджи-муви 10' },
]

const meta: Meta<typeof Autocomplete> = {
	title: 'shared/Autocomplete',
	component: Autocomplete,
	args: {
		disabled: false,
		readOnly: false,
		required: false,
		noFilter: false,
		menuHeight: '300px',
		menuWidth: '100%',
		menuPosition: 'bottom',
		defaultWidth: true,
	},
}

export default meta

type Story = StoryObj<typeof Autocomplete>

const SingleAutocompleteWrapper = (args: any) => {
	const [value, setValue] = useState<string>('')
	const [selectedValue, setSelectedValue] = useState<string>('')

	const handleChange = useCallback((value: string) => {
		setValue(value)
	}, [])

	const handleSelect = useCallback((value: string | string[]) => {
		setSelectedValue(value as string)
	}, [])

	return (
		<Autocomplete
			value={value}
			selectedValue={selectedValue}
			onChange={handleChange}
			onSelect={handleSelect}
			options={movies}
			renderInput={(params, actions) => (
				<TextField
					size="large"
					label="Label"
					placeholder="Placeholder..."
					Actions={actions}
					{...params}
				/>
			)}
			{...args}
		/>
	)
}

const MultiAutocompleteWrapper = (args: any) => {
	const [value, setValue] = useState<string>('')
	const [selectedValue, setSelectedValue] = useState<string[]>([])

	const handleChange = useCallback((value: string) => {
		setValue(value)
	}, [])

	const handleSelect = useCallback((value: string | string[]) => {
		setSelectedValue(value as string[])
	}, [])

	return (
		<Autocomplete
			value={value}
			selectedValue={selectedValue}
			onChange={handleChange}
			onSelect={handleSelect}
			options={movies}
			renderInput={(params, actions) => (
				<TextField
					size="large"
					label="Label"
					placeholder="Placeholder..."
					Actions={actions}
					{...params}
				/>
			)}
			{...args}
		/>
	)
}

const LocationAutocompleteWrapper = (args: any) => {
	const getLocations = async (query: string) => {
		const response = await fetch(
			`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=339f2de6a802429dbee964e900fe34a5`
		)
		const data = await response.json()
		return data.results
	}

	const [options, setOptions] = useState<Option[]>([])
	const [value, setValue] = useState<string>('')
	const [selectedValue, setSelectedValue] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleChange = useCallback((value: string) => {
		setValue(value)
	}, [])

	const handleSelect = useCallback((value: string | string[]) => {
		setSelectedValue(value as string)
	}, [])

	useEffect(() => {
		if (value !== '') {
			const fetchLocations = async () => {
				setIsLoading(true)
				try {
					const locations = await getLocations(value)

					const formattedOptions = locations.map((location: any) => ({
						value: location.geometry.lat + ',' + location.geometry.lng,
						label: location.formatted,
					}))
					setOptions(formattedOptions)
					setIsLoading(false)
				} catch (error) {
					console.error('Ошибка при получении локаций:', error)
					setOptions([])
					setIsLoading(false)
				}
			}

			fetchLocations()
		} else {
			setOptions([])
		}
	}, [value])

	return (
		<>
			<Autocomplete
				value={value}
				selectedValue={selectedValue}
				onChange={handleChange}
				onSelect={handleSelect}
				options={options}
				renderOption={(option, props) => {
					return (
						<OptionItem key={option.value} value={option.value} {...props}>
							{' '}
							<Location size="small-x" />
							{option.label}
						</OptionItem>
					)
				}}
				renderInput={(params, actions) => (
					<TextField
						size="large"
						label="Location"
						placeholder="Select location..."
						Actions={[
							isLoading ? <CircularProgress size="medium" /> : undefined,
							...actions,
						]}
						{...params}
					/>
				)}
				{...args}
			/>
		</>
	)
}

const ControlledAutocompleteWrapper = (args: any) => {
	const [options, setOptions] = useState<Option[]>([])
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [value, setValue] = useState<string>('')
	const [selectedValue, setSelectedValue] = useState<string>('')

	const timeoutId = useRef<NodeJS.Timeout | null>(null)

	const handleChange = useCallback((value: string) => {
		setValue(value)
	}, [])

	const handleSelect = useCallback((value: string | string[]) => {
		setSelectedValue(value as string)
	}, [])

	const handleOpen = useCallback(() => {
		setIsOpen(true)
		setIsLoading(true)
		timeoutId.current = setTimeout(() => {
			setOptions(movies)
			setIsLoading(false)
		}, 1000)
	}, [])

	const handleClose = useCallback(() => {
		setIsOpen(false)
		setOptions([])
		if (timeoutId.current) {
			clearTimeout(timeoutId.current)
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		return () => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current)
			}
		}
	}, [])

	return (
		<Autocomplete
			isOpen={isOpen}
			onOpen={handleOpen}
			onClose={handleClose}
			value={value}
			selectedValue={selectedValue}
			onChange={handleChange}
			onSelect={handleSelect}
			options={options}
			isLoading={isLoading}
			renderInput={(params, actions) => (
				<TextField
					size="large"
					label="Label"
					placeholder="Placeholder..."
					Actions={[
						isLoading ? <CircularProgress size="medium" /> : undefined,
						...actions,
					]}
					{...params}
				/>
			)}
			{...args}
		/>
	)
}

export const SingleAutocomplete: Story = {
	render: (args) => SingleAutocompleteWrapper(args),
}

export const MultiAutocomplete: Story = {
	render: (args) => MultiAutocompleteWrapper(args),
}

export const MultiAutocompleteWithChips: Story = {
	render: (args) => MultiAutocompleteWrapper(args),
	args: {
		renderTags: (value, label, params) => (
			<Chip
				key={value}
				size="small"
				color="secondary"
				tabIndex={-1}
				label={label}
				{...params}
			/>
		),
	},
}

export const LocationAutocomplete: Story = {
	render: (args) => LocationAutocompleteWrapper(args),
	args: {
		noFilter: true,
	},
}

export const ControlledAutocomplete: Story = {
	render: (args) => ControlledAutocompleteWrapper(args),
}


import { Icon } from '@/shared/ui/Icon'
import './styles/main.scss'
import { IconButton } from '@/shared/ui/IconButton'

export default function App() {
	return (
		<div className="app">
			<p>Hello world</p>
			<p>Hello world</p>
			<h4>Hello world</h4>
			<div className='btn' tabIndex={0}>Heee</div>
			<IconButton>5</IconButton>
			<IconButton variant='outlined'>5</IconButton>
			<IconButton variant='clear'>5</IconButton>
			<Icon variant='bell'/>
			
		</div>
	)
}

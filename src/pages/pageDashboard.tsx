import Bubble from '@components/ui/Bubble'
import Container from '@components/ui/Container'
import { Button } from '@mui/material'
import { supportLink } from '@static/links'
import { useNavigate } from 'react-router-dom'

export default function PageDashboard() {
	const navigate = useNavigate()

	return (
		<Container>
			<h1 className='text-2xl font-bold '>Umafic ADS</h1>
			<div className='flex gap-3 mt-5'>
				<Button
					href={supportLink}
					target='_blank'
					className='!rounded-full !shadow-none'
					variant='contained'
				>
					Тех.поддержка
				</Button>
			</div>
			<article className='grid grid-cols-auto-fill-300 gap-5 mt-10'>
				<div>
					<Bubble onClick={() => navigate('/campaigns/direct')}>
						<div className='flex items-center justify-between mb-5'>
							<h1 className='text-2xl'>Поиск клиентов</h1>
						</div>
					</Bubble>
				</div>
				<Bubble onClick={() => navigate('/campaigns/pr')}>
					<div className='flex items-center justify-between mb-5'>
						<h1 className='text-2xl'>Пиар в чатах</h1>
					</div>
				</Bubble>
			</article>
		</Container>
	)
}

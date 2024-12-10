import Container from '@components/ui/Container'
import { ArrowBack } from '@mui/icons-material'
import { Button, CircularProgress } from '@mui/material'
import { lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
const DirectCampaignsList = lazy(
	() => import('@components/campaigns/direct/DirectCampaignsList')
)

export default function PageDirectCampaigns() {
	const navigate = useNavigate()

	return (
		<Container>
			<h1 className='text-2xl font-bold'>Поиск клиентов</h1>
			<div className='flex justify-between mt-2 gap-4 sm:mt-0'>
				<Button onClick={() => navigate('/')}>
					<ArrowBack /> Назад
				</Button>
				<Button
					onClick={() => navigate('/campaigns/direct/create')}
					color='success'
					className='!rounded-full'
					variant='outlined'
				>
					Создать
				</Button>
			</div>
			<Suspense fallback={<CircularProgress />}>
				<DirectCampaignsList />
			</Suspense>
		</Container>
	)
}

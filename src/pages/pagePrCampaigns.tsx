import Container from '@components/ui/Container'
import { ArrowBack } from '@mui/icons-material'
import { Button, CircularProgress } from '@mui/material'
import { lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'

const PrCampaignsList = lazy(() => import('@components/campaigns/pr/PrCampaignList'))

export default function PagePrCampaigns() {
	const navigate = useNavigate()

	return (
		<Container>
			<h1 className='text-2xl font-bold'>Пиар в чатах</h1>
			<div className='flex justify-between mt-2 gap-4 sm:mt-0'>
				<Button onClick={() => navigate('/')}>
					<ArrowBack /> Назад
				</Button>
				<Button
					onClick={() => navigate('/campaigns/pr/create')}
					color='success'
					className='!rounded-full'
					variant='outlined'
				>
					Создать
				</Button>
			</div>
			<Suspense fallback={<CircularProgress />}>
				<PrCampaignsList />
			</Suspense>
		</Container>
	)
}

import Container from '@components/ui/Container'
import { ArrowBack } from '@mui/icons-material'
import { Button, CircularProgress } from '@mui/material'
import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'

const DirectCampaignSettingsWrapper = lazy(
	() => import('@components/wrappers/DirectCampaignSettingsWrapper')
)
const DirectCampaignSettingsForm = lazy(
	() => import('@components/campaigns/direct/DirectCampaignSettingsForm')
)

export default function PageUpsertDirectCampaign() {
	const { id } = useParams()
	const campaignId = id ? parseInt(id) : null

	return (
		<Container>
			<h1 className='text-2xl font-bold'>Поиск клиентов</h1>
			<Link className='block' to='/campaigns/direct'>
				<Button color='primary'>
					<ArrowBack />
					Назад
				</Button>
			</Link>
			<div className='mx-auto w-full h-full max-w-[600px]'>
				<Suspense fallback={<CircularProgress color='inherit' />}>
					<DirectCampaignSettingsWrapper campaignId={campaignId}>
						<DirectCampaignSettingsForm />
					</DirectCampaignSettingsWrapper>
				</Suspense>
			</div>
		</Container>
	)
}

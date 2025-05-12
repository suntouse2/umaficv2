import Container from '@components/ui/Container'
import { ArrowBack } from '@mui/icons-material'
import { Button, CircularProgress } from '@mui/material'
import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'

const PrCampaignSettingsWrapper = lazy(
	() => import('@components/wrappers/PrCampaignSettingsWrapper')
)
const PrCampaignSettingsForm = lazy(
	() => import('@components/campaigns/pr/PrCampaignSettingsForm')
)

export default function PageUpsertPrCampaign() {
	const { id } = useParams()
	const campaignId = id ? parseInt(id) : null

	return (
		<Container>
			<h1 className='text-2xl font-bold'>Пиар в чатах</h1>
			<Link className='' to='/campaigns/pr'>
				<Button color='primary'>
					<ArrowBack />
					Назад
				</Button>
			</Link>
			<div className='mx-auto w-full h-full max-w-[600px]'>
				<Suspense fallback={<CircularProgress color='inherit' />}>
					<PrCampaignSettingsWrapper campaignId={campaignId}>
						<PrCampaignSettingsForm />
					</PrCampaignSettingsWrapper>
				</Suspense>
			</div>
		</Container>
	)
}

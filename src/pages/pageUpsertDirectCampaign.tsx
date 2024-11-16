import DirectCampaignService from '@api/http/services/campaigns/DirectCampaignService'
import DirectCampaignUpsertForm from '@components/campaigns/direct/DirectCampaignUpsertForm'
import Container from '@components/wrappers/layouts/Container'
import { mapDirectCampaignSettingsFromResponse } from '@helpers/campaigns/direct/mapDirectCampaignSettings'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function PageUpsertDirectCampaign() {
	const location = useLocation()
	const navigate = useNavigate()
	const path = location.pathname
	const { id } = location.state || {}
	const [data, setData] = useState<
		| (TDirectCampaignSettings & {
				temporary: {
					first_message: { messages: TFunnelMessage[] }[]
					any_message: { messages: TFunnelMessage[] }[]
				}
		  })
		| null
	>(null)

	const fetchCampaign = useCallback(async (id: number) => {
		const { data } = await DirectCampaignService.getDirectCampaign(id)
		setData(mapDirectCampaignSettingsFromResponse(data))
	}, [])

	useEffect(() => {
		if (path.split('/')[3] === 'edit' && !id) {
			return navigate('/campaigns/direct')
		}
		if (path.split('/')[3] === 'edit' && id) fetchCampaign(id)
	}, [fetchCampaign, id, navigate, path])

	return (
		<Container>
			{path.split('/')[3] === 'edit' && data && (
				<DirectCampaignUpsertForm id={id} data={data} />
			)}
			{path.split('/')[3] === 'create' && <DirectCampaignUpsertForm />}
		</Container>
	)
}

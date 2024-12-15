import { useFetchDirectCampaigns } from '@api/queries'
import DirectCampaignCard from '@components/campaigns/direct/DirectCampaignCard'
import { CircularProgress } from '@mui/material'
import { memo, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

export default memo(function DirectCampaignsList() {
	const { data, isPending, fetchNextPage } = useFetchDirectCampaigns()
	const listRef = useRef<HTMLUListElement | null>(null)
	const { ref, inView } = useInView({
		root: listRef.current,
		rootMargin: '100px',
	})
	const campaigns = data ? data.pages.flatMap(campaigns => campaigns.data) : []

	useEffect(() => {
		if (inView) fetchNextPage()
	}, [fetchNextPage, inView])

	return (
		<ul className='flex flex-col p-0 pt-2 md:p-4 md:pt-3 sm:grid grid-cols-auto-fit-450 gap-2'>
			{isPending && <CircularProgress color='inherit' />}
			{campaigns.map(campaign => (
				<li key={campaign.id}>
					<DirectCampaignCard campaign={campaign} />
				</li>
			))}
			{data && <div ref={ref}></div>}
		</ul>
	)
})

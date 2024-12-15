import { ArrowBack, Done, MoodBad } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { useChatStore } from '../../store/chatStore'
import Direct from './Direct'

export default function DirectsList() {
	const navigate = useNavigate()
	const campaignId = useChatStore(state => state.campaignId)
	const directs = useChatStore(state => state.directs)
	const isDirectsFetching = useChatStore(state => state.isDirectsFetching)
	const fetchDirects = useChatStore(state => state.fetchDirects)
	const fetchDirect = useChatStore(state => state.fetchDirect)
	const directsFilter = useChatStore(state => state.directsFilter)
	const setDirectsFilter = useChatStore(state => state.setDirectsFilter)
	const handleDirectClick = useCallback(
		(directId: number) => {
			fetchDirect(directId)
			const newHash = window.location.pathname + `#/chat/${campaignId}/${directId}`
			window.history.pushState({}, '', newHash)
		},

		[campaignId, fetchDirect]
	)

	const listRef = useRef<HTMLUListElement | null>(null)

	const { ref, inView } = useInView({
		root: listRef.current,
		rootMargin: '100px',
	})

	const handleSwitchFilter = () => {
		if (directsFilter == 'all') {
			setDirectsFilter('favorite')
		} else {
			setDirectsFilter('all')
		}
	}

	useEffect(() => {
		if (inView) fetchDirects()
	}, [inView, fetchDirects])

	return (
		<article className='border-t border-r py-2 border-border overflow-hidden w-[480px] h-full'>
			<div className='flex items-center px-2 border-b border-border justify-between py-1'>
				<Button
					size='small'
					className='!mb-1 !p-0 !text-xs'
					onClick={() => navigate('/')}
				>
					<ArrowBack /> Назад
				</Button>
				<Button
					onClick={handleSwitchFilter}
					variant='contained'
					color={directsFilter == 'favorite' ? 'primary' : 'inherit'}
					className='!shadow-none !py-1 !px-2 !mb-1 !text-xs !rounded-full'
				>
					{directsFilter == 'favorite' && <Done fontSize='small' />} Только избранные
				</Button>
			</div>
			{!isDirectsFetching && directs.length == 0 && (
				<div className='flex flex-col items-center justify-center'>
					<div className='flex items-center gap-2 mt-4'>
						<MoodBad /> <h2 className='font-semibold'>У вас 0 диалогов</h2>
					</div>
					<p className='text-sm text-softgray3'>Возможно, нужно немного подождать</p>
				</div>
			)}
			<ul ref={listRef} className='w-full h-full chatScroll overflow-scroll'>
				{directs.map(direct => (
					<Direct
						key={direct.id}
						onClick={() => handleDirectClick(direct.id)}
						direct={direct}
					/>
				))}
				{directs.length > 0 && <div ref={ref}></div>}
			</ul>
		</article>
	)
}

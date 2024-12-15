import { CircularProgress } from '@mui/material'
import { motion } from 'motion/react'
import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'

const DirectsList = lazy(() => import('@components/chat/DirectsList'))
const ChatScreen = lazy(() => import('@components/chat/ChatScreen'))
const ChatWrapper = lazy(() => import('@components/wrappers/ChatWrapper'))

export default function PageChat() {
	const params = useParams()
	const directId = params.directId ? Number(params.directId) : null
	const campaignId = Number(params.campaignId)

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='flex w-full h-full'
		>
			<Suspense fallback={<CircularProgress />}>
				<ChatWrapper directId={directId} campaignId={campaignId}>
					<DirectsList />
					<ChatScreen />
				</ChatWrapper>
			</Suspense>
		</motion.section>
	)
}

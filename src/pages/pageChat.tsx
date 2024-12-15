import ChatScreen from '@components/chat/ChatScreen'
import DirectsList from '@components/chat/DirectsList'
import ChatWrapper from '@components/wrappers/ChatWrapper'
import { motion } from 'motion/react'
import { useParams } from 'react-router-dom'

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
			<ChatWrapper directId={directId} campaignId={campaignId}>
				<DirectsList />
				<ChatScreen />
			</ChatWrapper>
		</motion.section>
	)
}

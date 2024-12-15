import ChatScreen from '@components/chat/ChatScreen'
import DirectsList from '@components/chat/DirectsList'
import { ChatProvider } from '@context/chat/ChatContext'
import { ArrowBack } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

export default function PageChat() {
	const params = useParams()
	const directId =
		params.directId !== undefined ? Number(params.directId) : null
	const campaignId = Number(params.campaignId)
	const navigate = useNavigate()

	const handleGoBack = () => {
		return directId
			? navigate(`/chat/${campaignId}`)
			: navigate('/campaigns/direct')
	}

	return (
		<div className='flex flex-col overflow-hidden h-dvh'>
			<ChatProvider campaignId={campaignId} directId={directId}>
				<div>
					<Button onClick={handleGoBack}>
						<ArrowBack /> Назад
					</Button>
				</div>
				<div className='hidden lg:grid h-full w-full border-t-[1px] border-softgray overflow-hidden grid-cols-[max-content,1fr]'>
					<DirectsList />
					<ChatScreen />
				</div>
				<div className='block lg:hidden h-full w-full border-t-[1px] border-softgray overflow-hidden'>
					{directId === null ? <DirectsList /> : <ChatScreen />}
				</div>
			</ChatProvider>
		</div>
	)
}

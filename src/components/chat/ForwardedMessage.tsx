import MediaRenderer from '@components/MediaRenderer'
import dateToRelativeString from '@helpers/dateToRelativeString'
import { Link } from 'react-router-dom'

type ForwardedMessageProps = {
	message: TChatMessage['forwarded_message']
}

export default function ForwardedMessage({ message }: ForwardedMessageProps) {
	if (!message) return <></>

	const author = (message.user?.first_name ?? '') + ' ' + (message.user?.last_name ?? '')
	const date = dateToRelativeString(new Date(message.date))
	const text = message.content.message
	const media = message.content.media
	const channel = message.channel.username
	return (
		<div>
			<b className='text-softgray3 text-xs'>Пересланное сообщение</b>
			<div className='border-l-[2px] border-primary pl-2 mt-2'>
				<Link target='_blank' to={message.channel.link} className='text-sm text-primary'>
					@{channel}
				</Link>
				<div className='flex gap-2 items-center'>
					<b className='text-sm'>{author}</b>
					<span className='text-xs text-softgray3'>{date}</span>
				</div>
				<p className='w-full break-all'>{text}</p>
				<MediaRenderer media={media} />
			</div>
		</div>
	)
}

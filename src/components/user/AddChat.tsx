import ChannelsService from '@api/http/services/ChannelsService'
import Tagger from '@components/Tagger'
import { Button } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddChat() {
	const [tags, setTags] = useState<
		{
			id: string
			value: string
		}[]
	>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const parseTag = (input: string): string => {
		const match = input.match(/(?:https:\/\/t\.me\/|@|)([a-zA-Z0-9_]+)/)
		return match ? match[1] : input
	}

	const handleSubmit = async () => {
		setIsLoading(true)
		await toast.promise(
			ChannelsService.addChannels({
				usernames: tags.map(v => v.value),
			}),
			{
				pending: 'Добавление каналов...',
				success: 'Чаты успешно добавлены!',
				error: 'Произошла ошибка при добавлении каналов',
			}
		)
		setIsLoading(false)
		setTags([])
	}

	return (
		<article>
			<h2 className='text-lg font-bold'>Добавление чатов</h2>
			<p className='mb-2 text-sm mt-4'>
				Вы можете добавить свои чаты Telegram, дополнительно к чатам из нашей системы
			</p>
			<Tagger
				className='border-border border !w-full'
				selectable={false}
				useAI={false}
				placeholder='вставьте ссылку/тег'
				onChange={setTags}
				tagParser={v => parseTag(v)}
				tagClassName='bg-primary text-white'
				activeTags={tags}
			/>
			<div className='mt-4'>
				<Button
					onClick={handleSubmit}
					disabled={Boolean(!tags.length) || isLoading}
					variant='outlined'
					className='!w-full !rounded-full'
					color='secondary'
				>
					Добавить чаты
				</Button>
			</div>
		</article>
	)
}

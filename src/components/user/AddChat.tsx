import ChannelsService from '@api/http/services/ChannelsService'
import PopOrDialog from '@components/common/PoporDialog'
import { Add, Edit, LibraryBooks } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { KeyboardEvent, useState } from 'react'
import { toast } from 'react-toastify'

export default function AddChat() {
	const [isList, setIsList] = useState<boolean>(false)
	const [value, setValue] = useState<string>('')
	const Input = isList ? 'textarea' : 'input'
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const parseChat = (input: string): string => {
		const match = input.match(/(?:https:\/\/t\.me\/|@|)([a-zA-Z0-9_]+)/)
		return match ? match[1] : input
	}

	const handleAddChats = async () => {
		if (isLoading) return
		const chats = isList ? value.split('\n') : [value]
		const parsedChats = chats.map(chat => parseChat(chat))
		setIsLoading(true)
		await toast.promise(
			ChannelsService.addChannels({
				usernames: parsedChats,
			}),
			{
				pending: 'Добавление каналов...',
				success: 'Чаты успешно добавлены!',
				error: 'Произошла ошибка при добавлении каналов',
			}
		)
		setValue('')
		setIsLoading(false)
	}
	const handleInputKeydown = (e: KeyboardEvent<HTMLElement>) => {
		if (e.key === 'Enter' && !isList) {
			e.stopPropagation()
			e.preventDefault()
			handleAddChats()
		}
	}

	return (
		<article>
			<h2 className='text-lg font-bold'>Добавление чатов</h2>
			<p className='mb-2 text-sm mt-4'>
				Вы можете добавить свои чаты Telegram, дополнительно к чатам из нашей системы
			</p>
			<PopOrDialog title='Добавить чат'>
				<div className='flex items-center'>
					<Input
						onKeyDown={handleInputKeydown}
						className={`w-full p-2 bg-[inherit] outline-none text-sm ${
							isList && 'min-h-40'
						}`}
						placeholder='Ссылка/тег или чата'
						value={value}
						onChange={v => setValue(v.currentTarget.value)}
					/>
					<IconButton onClick={handleAddChats}>
						<Add />
					</IconButton>
					<IconButton onClick={() => setIsList(list => !list)}>
						{isList ? <Edit /> : <LibraryBooks />}
					</IconButton>
				</div>
			</PopOrDialog>
		</article>
	)
}

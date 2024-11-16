import CampaignMessageCreator from '@components/campaigns/CampaignMessageCreator'

import UtilsService from '@api/http/services/UtilsService'
import MediaRenderer from '@components/MediaRenderer'
import { AutoAwesome, Delete, Edit } from '@mui/icons-material'
import { Button, Dialog, IconButton } from '@mui/material'
import lodash from 'lodash'
import { useState } from 'react'
import { toast } from 'react-toastify'
type CampaignMessageProps = {
	value: {
		messages: TFunnelMessage[]
		order?: number
		keywords?: string[]
	}[]
	onChange: (
		value: { messages: TFunnelMessage[]; order?: number; keywords?: string[] }[]
	) => void
	filter_type: 'order' | 'keyword' | 'none'
	error?: string
	maxMsgLength?: number
}

type CurrentMessage = {
	message: TFunnelMessage
	index: number
	order?: number
	keywords?: string[]
}

export default function CampaignMessageManager({
	value,
	onChange,
	filter_type,
	error,
	maxMsgLength,
}: CampaignMessageProps) {
	const initialData = {
		index: -1,
		message: {
			message: '',
			media: null,
		},
		...(filter_type === 'order' && {
			order: (value.slice(-1)[0]?.order ?? 1) + 1,
		}),
		...(filter_type === 'keyword' && { keywords: [] }),
	}
	const [dialogState, setDialogState] = useState<boolean>(false)
	const [currentMessage, setCurrentMessage] =
		useState<CurrentMessage>(initialData)

	const updateMessage = (data: {
		message: TFunnelMessage
		order?: number
		keywords?: string[]
	}) => {
		const filterIndex = value.findIndex(o =>
			filter_type === 'order'
				? o.order === currentMessage.order
				: lodash.isEqual(o.keywords, currentMessage.keywords)
		)

		const updatedValue = [...value]

		if (filterIndex !== -1 && currentMessage.index !== -1) {
			updatedValue[filterIndex].messages.splice(currentMessage.index, 1)

			if (updatedValue[filterIndex].messages.length === 0) {
				updatedValue.splice(filterIndex, 1)
			}
		}

		const newFilterIndex = updatedValue.findIndex(o =>
			filter_type === 'order'
				? o.order === data.order
				: lodash.isEqual(o.keywords, data.keywords)
		)

		const target =
			newFilterIndex !== -1
				? updatedValue[newFilterIndex]
				: { messages: [], order: data.order, keywords: data.keywords }

		target.messages.push(data.message)

		if (newFilterIndex !== -1) {
			updatedValue[newFilterIndex] = target
		} else {
			updatedValue.push(target)
		}

		onChange(updatedValue)
		setCurrentMessage(initialData)
	}

	const removeMessage = (filterIndex: number, messageIndex: number) => {
		const cValue = [...value]
		cValue[filterIndex].messages.splice(messageIndex, 1)
		if (cValue[filterIndex].messages.length == 0) {
			cValue.splice(filterIndex, 1)
		}
		toast.info('Сообщение удалено')
		return onChange(cValue)
	}
	const handleAddMessage = () => {
		setCurrentMessage(initialData)
		setDialogState(true)
	}

	const handleAI = async (
		message: string,
		filter: { order?: number; keywords?: string[] }
	) => {
		try {
			toast.info('Генерация вариантов...')
			const { data } = await UtilsService.spintax(message, 5)
			setCurrentMessage(initialData)
			data.forEach(msg =>
				updateMessage({ message: { message: msg, media: null }, ...filter })
			)
		} catch {
			toast.error('Не получилось добавить еще вариантов через нейросеть.')
		}
	}

	const handleEditMessage = (filterIndex: number, messageIndex: number) => {
		setCurrentMessage({
			index: messageIndex,
			message: value[filterIndex].messages[messageIndex],
			order: value[filterIndex].order,
			keywords: value[filterIndex].keywords,
		})
		setDialogState(true)
	}

	return (
		<div>
			<Button
				onClick={handleAddMessage}
				variant='outlined'
				color='secondary'
				className='!rounded-full'
			>
				Создать
			</Button>
			<Dialog
				PaperProps={{
					style: { width: '100%', maxWidth: '500px' },
					className: 'py-4 px-1',
				}}
				open={dialogState}
				onClose={() => setDialogState(false)}
			>
				<CampaignMessageCreator
					maxMsgLength={maxMsgLength}
					data={currentMessage}
					onClose={() => setDialogState(false)}
					updateMessage={updateMessage}
					filter_type={filter_type}
				/>
			</Dialog>
			<hr className='border-none h-[1px] bg-softgray4 opacity-15 mt-4 w-full' />
			<ul className='flex flex-col gap-2 mt-2'>
				{value &&
					value.length > 0 &&
					value.map((v, i) =>
						v.messages.map((m, i2) => (
							<li
								className='bg-inputbg max-w-full p-4 rounded-sm overflow-hidden'
								key={`${i}-${i2}`}
								onClick={e => {
									if (e.target === e.currentTarget) {
										handleEditMessage(i, i2)
									}
								}}
								style={{ cursor: 'pointer' }}
							>
								<div className='flex justify-end items-center mb-2'>
									<IconButton
										onClick={e => {
											e.stopPropagation()
											handleAI(m.message, {
												keywords: v.keywords,
												order: v.order,
											})
										}}
									>
										<AutoAwesome />
									</IconButton>
									<IconButton
										onClick={e => {
											e.stopPropagation()
											handleEditMessage(i, i2)
										}}
									>
										<Edit />
									</IconButton>
									<IconButton
										onClick={e => {
											e.stopPropagation()
											removeMessage(i, i2)
										}}
									>
										<Delete />
									</IconButton>
								</div>
								<p className='break-words max-w-full mb-4'>{m.message}</p>
								{m.media !== null && <MediaRenderer media={m.media} />}
								{v.order && (
									<span className='text-sm'>
										<i>{v.order}</i> по порядку
									</span>
								)}
								{v.keywords && (
									<span className='text-sm'>
										ключевые слова: <i>{v.keywords.join(',')}</i>
									</span>
								)}
							</li>
						))
					)}
			</ul>
			{error && <p className='text-sm text-negative mt-2'>{error}</p>}
		</div>
	)
}

import Channel from '@components/Channel'
import TextArea from '@components/common/TextArea'
import Bubble from '@components/ui/Bubble'
import { Button, Dialog } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { usePrCampaignSettingsStore } from '../../../store/prCampaignSettingsStore'

export default function PrCampaignChatSettings() {
	const [channelsValue, setChannelsValue] = useState<string>('')
	const [dialog, setDialog] = useState<boolean>(false)
	const channels = usePrCampaignSettingsStore(state => state.settings.channels.include)
	const setChannel = usePrCampaignSettingsStore(state => state.setChannel)

	const removeChannelById = (id: string) => {
		setChannel(
			'include',
			channels.filter(c => c.id !== id)
		)
	}

	const formatAndSetChannels = () => {
		const cleaned = channelsValue
			.split('\n')
			.map(line => line.trim())
			.filter(line => line.startsWith('https://t.me/'))
			.map(line => {
				const tag = line.replace('https://t.me/', '')
				return {
					id: nanoid(),
					value: tag,
				}
			})

		setChannel('include', [...channels, ...cleaned])
		setChannelsValue('')
		setDialog(false)
	}

	const animation = {
		initial: {
			opacity: 0,
			y: -5,
		},
		animate: {
			opacity: 1,
			y: 0,
		},
		exit: {
			opacity: 0,
			y: 5,
		},
	}

	return (
		<>
			<Dialog open={dialog} onClose={() => setDialog(false)}>
				<div className='p-4'>
					<h2 className='text-2xl font-medium'>База чатов</h2>
					<p className='text-sm mt-2 mb-2'>
						Добавьте один или несколько чатов в следующем формате:
						<br />
						https://t.me/umafic
					</p>
					<p className='text-sm mt-6 mb-2'>
						После прохождения модерации чаты будут доступны для работы в системе. <br />
						(Модерация до 24 часов)
					</p>
					<TextArea
						value={channelsValue}
						onChange={setChannelsValue}
						placeholder='Новые чаты'
						className='mt-4'
					></TextArea>
					<Button
						onClick={formatAndSetChannels}
						variant='outlined'
						className='!rounded-full !mt-4'
						color='secondary'
					>
						Отправить на модерацию
					</Button>
				</div>
			</Dialog>
			<Bubble className='mt-4'>
				<h2 className='text-lg font-bold'>Своя база чатов</h2>
				<p className='text-sm mt-2 mb-2'>
					Данный инструмент позволяет использовать базу собственных чатов. Вы можете
					добавить один или несколько чатов в систему.
				</p>
				<Button
					onClick={() => setDialog(true)}
					variant='outlined'
					className='!rounded-full !mt-4'
					color='secondary'
				>
					Добавить чаты
				</Button>
				<ul className='flex flex-col gap-2 mt-4'>
					<AnimatePresence>
						{channels.map(channel => (
							<motion.li layout {...animation} key={channel.id}>
								<Channel
									value={channel.value}
									onRemove={() => removeChannelById(channel.id)}
								/>
							</motion.li>
						))}
					</AnimatePresence>
				</ul>
			</Bubble>
		</>
	)
}

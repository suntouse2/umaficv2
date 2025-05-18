import Input from '@components/common/Input'
import Funnely from '@components/Funnely'
import Bubble from '@components/ui/Bubble'
import { Add } from '@mui/icons-material'
import { Avatar, Button, Dialog } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { usePrCampaignSettingsStore } from '../../../store/prCampaignSettingsStore'

type CurrentFunnel = {
	filter?: number
}
type CurrentDelay = {
	min: number
	max: number
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

export default function PrCampaignFunnelSettings() {
	const [messages, setFunnel] = usePrCampaignSettingsStore(
		useShallow(state => [state.settings.auto_reply.funnel.messages, state.setFunnel])
	)
	const [delays] = usePrCampaignSettingsStore(
		useShallow(state => [state.settings.auto_reply.funnel.delays])
	)

	const [currentDelay, setCurrentDelay] = useState<CurrentDelay>({
		min: 20,
		max: 60,
	})
	const [currentFunnel, setCurrentFunnel] = useState<CurrentFunnel>({
		filter: 0,
	})
	const [dialog, setDialog] = useState<boolean>(false)
	const [orderFunnels, setOrderFunnels] = useState<number[]>([])

	const openMessagesDialog = (funnel: CurrentFunnel) => {
		const delay = delays.find(d => d.order === funnel.filter)
		if (delay) {
			setCurrentDelay(delay.delay)
		}

		setCurrentFunnel(funnel)
		setDialog(true)
	}
	const closeMessagesDialog = () => {
		if (delays.find(d => d.order == currentFunnel.filter)) {
			setFunnel('delays', [
				...delays.map(d =>
					d.order == currentFunnel.filter
						? {
								order: d.order,
								delay: currentDelay,
						  }
						: d
				),
			])
		} else {
			setFunnel('delays', [
				...delays,
				{
					order: currentFunnel.filter ?? 0,
					delay: currentDelay,
				},
			])
		}

		setDialog(false)
	}
	const removeByOrder = (filter: number) => {
		setOrderFunnels(prev => prev.filter(i => i !== filter))
		setFunnel('messages', [...messages.filter(i => i.filter !== filter)])
	}

	useEffect(() => {
		const orderMessages = messages.filter(m => m.type === 'any')
		const orderFilters = orderMessages
			.map(m => (typeof m.filter === 'number' ? m.filter : null))
			.filter(f => f !== null)
			.filter(f => f > 0)
		const uniqueOrders = Array.from(new Set(orderFilters)).sort((a, b) => a - b)
		setOrderFunnels(uniqueOrders)
	}, [messages])

	return (
		<>
			<Dialog
				PaperProps={{
					className: 'w-full',
				}}
				open={dialog}
				onClose={closeMessagesDialog}
			>
				<div className='p-4'>
					<h2 className='flex items-center  gap-2 text-xl font-bold'>
						<Avatar sx={{ width: 35, height: 35, opacity: 0.5 }} />{' '}
						{currentFunnel.filter == 0
							? 'Ведущий бот'
							: `#${currentFunnel.filter ? currentFunnel.filter + 1 : 1} Бот`}
					</h2>
					<Bubble className='relative mt-4'>
						<h2 className='text-lg font-bold'>Задержка времени</h2>
						<p className='text-sm'>Настройте задержку отправки сообщения.</p>
						<div className='flex gap-3 mt-4'>
							<div className='flex  w-min items-center gap-2 px-4  py-2 rounded-xl shadow-sm border-softgray border-solid border-[1px]'>
								<span className='text-sm'>От</span>
								<Input
									className='!w-[40px] h-8'
									onChange={v => {
										setCurrentDelay(p => ({
											...p,
											min: Number(v),
										}))
									}}
									maxNumber={60}
									minNumber={20}
									maxLength={3}
									onlyDigits={true}
									value={currentDelay.min.toString()}
									placeholder='5'
								/>
								<span className='text-sm'>минут</span>
							</div>
							<div className='flex  w-min items-center gap-2  py-2  px-4	rounded-xl shadow-sm border-softgray border-solid border-[1px]'>
								<span className='text-sm'>До</span>
								<Input
									className='!w-[40px] h-8'
									onChange={v => {
										setCurrentDelay(p => ({
											...p,
											max: Number(v),
										}))
									}}
									maxNumber={60}
									maxLength={3}
									onlyDigits={true}
									value={currentDelay.max.toString()}
									placeholder='5'
								/>
								<span className='text-sm'>минут</span>
							</div>
						</div>
					</Bubble>
					<Bubble className='relative mt-4'>
						<h2 className='text-lg font-bold'>Сообщения</h2>
						<p className='text-sm'>Сообщение, которое будет отправлено в чат.</p>

						<Funnely
							type='any'
							filter={currentFunnel.filter}
							messages={messages}
							onChange={v => setFunnel('messages', v)}
						/>
					</Bubble>
				</div>
			</Dialog>
			<Bubble className='relative mt-4'>
				<div>
					<h2 className='flex items-center  gap-2 mb-4 text-lg font-bold'>
						<Avatar sx={{ width: 35, height: 35, opacity: 0.5 }} /> Ведущий бот
					</h2>
				</div>
				<p className='text-sm'>
					Чат бот который первым инициирует общение с пользователем, отвечая на ключевые
					слова.
				</p>
				<Button
					onClick={() => openMessagesDialog({ filter: 0 })}
					variant='outlined'
					color='secondary'
					className='!rounded-full !mt-4 !px-6'
				>
					Сообщения
				</Button>
			</Bubble>
			<ul>
				<AnimatePresence>
					{orderFunnels.map(order => (
						<motion.li layout {...animation} key={order}>
							<Bubble className='relative mt-4'>
								<h2 className='flex items-center  gap-2 mb-4 text-lg font-bold'>
									<Avatar sx={{ width: 35, height: 35, opacity: 0.5 }} /> #{order + 1} Бот
								</h2>

								<p className='text-sm mb-2'>
									Бот следует за "ботом выше", в цепочке общения. <br />
								</p>
								<Button
									onClick={() => openMessagesDialog({ filter: order })}
									variant='outlined'
									color='secondary'
									className='!rounded-full !mt-4 !px-6'
								>
									Сообщения
								</Button>
								<Button
									onClick={() => removeByOrder(order)}
									variant='outlined'
									color='error'
									className='!rounded-full !ml-2 !mt-4 !px-6'
								>
									Удалить
								</Button>
							</Bubble>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
			<Bubble className='flex mt-4 mb-4 items-center justify-center'>
				<Button
					variant='outlined'
					size='large'
					color='secondary'
					className='!rounded-full !mt-4 flex gap-2'
					onClick={() => setOrderFunnels(prev => [...prev, prev.length + 1])}
				>
					Добавить ответ <Add fontSize='large' />
				</Button>
			</Bubble>
		</>
	)
}

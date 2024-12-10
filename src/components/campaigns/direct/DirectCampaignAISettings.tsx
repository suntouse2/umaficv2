import TextArea from '@components/common/TextArea'
import { aiMessageTip } from '@components/helpers/directCampaignFormTips'
import Bubble from '@components/ui/Bubble'
import TipBox from '@components/ui/TipBox'
import { AutoAwesome } from '@mui/icons-material'
import { Button, Dialog, MenuItem, Select, Switch } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useDirectCampaignSettingsStore } from '../../../store/directCampaignSettingsStore'

export default function DirectCampaignAISettings() {
	const [dialog, setDialog] = useState<boolean>(false)
	const [useAssistant, assistant, setUseAssistant, setAssistant] =
		useDirectCampaignSettingsStore(
			useShallow(state => [
				state.settings.auto_reply.use_assistant,
				state.settings.auto_reply.assistant,
				state.setUseAssistant,
				state.setAssistant,
			])
		)
	return (
		<>
			<Dialog open={dialog} onClose={() => setDialog(false)}>
				<div className='p-6 min-w-[360px]'>
					<h2 className='font-semibold text-xl mb-2'>Настройка ИИ</h2>
					<div className='flex flex-col gap-2'>
						<Select
							size='small'
							value={assistant.gender}
							displayEmpty
							onChange={e => {
								setAssistant('gender', e.target.value as 'male' | 'female')
							}}
						>
							<MenuItem value='male'>Мужчина</MenuItem>
							<MenuItem value='female'>Женщина</MenuItem>
						</Select>
						<Select
							size='small'
							className='mt-2'
							value={assistant.role}
							displayEmpty
							onChange={e => {
								setAssistant('role', e.target.value as 'marketer' | 'user')
							}}
						>
							<MenuItem value='marketer'>Продажник</MenuItem>
							<MenuItem value='user'>Пользоавтель</MenuItem>
						</Select>
					</div>
					<TextArea
						placeholder='Описание для ИИ (задачи,контакты, детали, описание продукта)'
						maxLength={2048}
						className='w-full bg-white border-[1px] border-border h-[180px] mt-2'
						value={assistant.description}
						onChange={v => setAssistant('description', v)}
					/>

					<Button
						onClick={() => setDialog(false)}
						disabled={assistant.description.length == 0}
						variant='outlined'
						color='primary'
						className='w-full'
					>
						Сохранить
					</Button>
				</div>
			</Dialog>

			<Bubble className='relative mt-4'>
				<TipBox content={aiMessageTip} />
				<h2 className='text-lg font-bold'>
					Настройка диалога с искусственным интеллектом
				</h2>
				<p className='text-sm'>
					Настройка искусственного интеллекта для продолжения общения.
				</p>
				<div className='mt-2'>
					<div>
						<span>Включить искусственный интеллект </span>
						<Switch
							className=''
							checked={useAssistant}
							onChange={(_v, v) => setUseAssistant(v)}
							size='small'
						/>
					</div>

					<AnimatePresence>
						{useAssistant && (
							<motion.div
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 5 }}
							>
								<Button
									variant='outlined'
									className='!rounded-full  !mt-2 rainbowBorder'
									onClick={() => setDialog(true)}
								>
									<span className='text-[#000] flex gap-2 items-center'>
										<AutoAwesome fontSize='small' /> Настроить ИИ
									</span>
								</Button>
								{assistant.description.length == 0 && (
									<b className='block text-negative mt-2 text-sm'>
										Для правильной работы ИИ, нужно настроить описание
									</b>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</Bubble>
		</>
	)
}

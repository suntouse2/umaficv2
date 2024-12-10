import { useCreateDirectCampaign, useEditDirectCampaign } from '@api/queries'
import containsLink from '@helpers/containsLink'
import { Button, Tab, Tabs } from '@mui/material'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useShallow } from 'zustand/shallow'
import { useDirectCampaignSettingsStore } from '../../../store/directCampaignSettingsStore'
import DirectCampaignAISettings from './DirectCampaignAISettings'
import DirectCampaignCheckSettings from './DirectCampaignCheckSettings'
import DirectCampaignFunnelSettings from './DirectCampaignFunnelSettings'
import DirectCampaignKeywordSettings from './DirectCampaignKeywordSettings'
import DirectCampaignLaunchSettings from './DirectCampaignLaunchSettings'
import DirectCampaignLocationSettings from './DirectCampaignLocationSettings'
import DirectCampaignUserSettings from './DirectCampaignUserSettings'

export default function DirectCampaignSettingsForm() {
	const [activeTab, setActiveTab] = useState<number>(0)
	const navigate = useNavigate()
	const { firstNameLength, includeLength, messages, useAssistant, assistantDescription } =
		useDirectCampaignSettingsStore(
			useShallow(state => ({
				firstNameLength: state.settings.profile.first_name.length,
				includeLength: state.settings.keywords.include.length,
				messages: state.settings.auto_reply.funnel.messages,
				useAssistant: state.settings.auto_reply.use_assistant,
				assistantDescription: state.settings.auto_reply.assistant.description,
			}))
		)
	const first_messages = messages.filter(msg => msg.type == 'first')

	const tabs = [
		{ title: 'Профиль', disabled: false },
		{ title: 'Аудитория', disabled: firstNameLength === 0 },
		{ title: 'Таргет', disabled: firstNameLength === 0 },
		{ title: 'Сообщения', disabled: firstNameLength === 0 || includeLength === 0 },
		{
			title: 'Запуск',
			disabled:
				firstNameLength === 0 ||
				includeLength === 0 ||
				first_messages.length <= 4 ||
				first_messages.some(msg => containsLink(msg.message.message)) ||
				first_messages.some(msg => msg.message.message.length > 150) ||
				(useAssistant && assistantDescription.length == 0),
		},
	]

	const { mutateAsync: createDirectCampaign } = useCreateDirectCampaign()
	const { mutateAsync: editDirectCampaign } = useEditDirectCampaign()

	const getSettings = useDirectCampaignSettingsStore(state => state.getSettings)
	const resetSettings = useDirectCampaignSettingsStore(state => state.resetSettings)

	const handleNextTab = () => setActiveTab(tab => tab + 1)
	const handlePreviousTab = () => setActiveTab(tab => tab - 1)
	const handleDone = async () => {
		try {
			const { campaignId, settings } = getSettings()
			if (campaignId == null) await createDirectCampaign({ settings: settings })
			else
				await editDirectCampaign({
					id: campaignId,
					settings: settings,
				})
			toast.success(`Кампания ${campaignId === null ? 'создана' : 'изменена'}`)
			navigate('/campaigns/direct')
			resetSettings()
		} catch (error) {
			toast.error(String(error))
		}
	}

	return (
		<motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<Tabs
				textColor='secondary'
				indicatorColor='secondary'
				value={activeTab}
				onChange={(_e, v) => setActiveTab(v)}
				variant='scrollable'
				scrollButtons={false}
				allowScrollButtonsMobile
			>
				{tabs.map((tab, i) => (
					<Tab label={tab.title} disabled={tab.disabled} key={i} />
				))}
			</Tabs>
			{activeTab == 0 && <DirectCampaignUserSettings />}
			{activeTab == 1 && <DirectCampaignLocationSettings />}
			{activeTab == 2 && (
				<>
					<DirectCampaignKeywordSettings />
					<DirectCampaignCheckSettings />
				</>
			)}
			{activeTab == 3 && (
				<>
					<DirectCampaignFunnelSettings />
					<DirectCampaignAISettings />
				</>
			)}
			{activeTab == 4 && <DirectCampaignLaunchSettings />}
			<div className='flex justify-between gap-4 mt-2'>
				<Button
					onClick={handlePreviousTab}
					disabled={activeTab == 0}
					variant='outlined'
					className='!rounded-full w-full'
				>
					Назад
				</Button>
				<Button
					onClick={activeTab == 4 ? handleDone : handleNextTab}
					color={activeTab == 4 ? 'secondary' : 'primary'}
					disabled={tabs[activeTab + 1]?.disabled}
					variant='outlined'
					className='!rounded-full w-full'
				>
					{activeTab == 4 ? 'Сохранить' : 'Далее'}
				</Button>
			</div>
		</motion.form>
	)
}

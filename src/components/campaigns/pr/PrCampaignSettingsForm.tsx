import { useCreatePrCampaign, useEditPrCampaign } from '@api/queries'
import { Button, Tab, Tabs } from '@mui/material'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useShallow } from 'zustand/shallow'
import { usePrCampaignSettingsStore } from '../../../store/prCampaignSettingsStore'
import PrCampaignChatSettings from './PrCampaignChatSettings'
import PrCampaignCheckSettings from './PrCampaignCheckSettings'
import PrCampaignFunnelSettings from './PrCampaignFunnelSettings'
import PrCampaignKeywordSettings from './PrCampaignKeywordSettings'
import PrCampaignLaunchSettings from './PrCampaignLaunchSettings'
import PrCampaignLocationSettings from './PrCampaignLocationSettings'

export default function PrCampaignSettingsForm() {
	const [activeTab, setActiveTab] = useState<number>(0)
	const navigate = useNavigate()
	const { includeLength } = usePrCampaignSettingsStore(
		useShallow(state => ({
			includeLength: state.settings.keywords.include.length,
			messages: state.settings.auto_reply.funnel.messages,
		}))
	)
	const tabs = [
		{ title: 'Аудитория', disabled: false },
		{ title: 'Таргет', disabled: false },
		{ title: 'Сообщения', disabled: includeLength === 0 },
		{
			title: 'Запуск',
			disabled: includeLength === 0,
		},
	]

	const { mutateAsync: createPrCampaign } = useCreatePrCampaign()
	const { mutateAsync: editPrCampaign } = useEditPrCampaign()

	const getSettings = usePrCampaignSettingsStore(state => state.getSettings)
	const resetSettings = usePrCampaignSettingsStore(state => state.resetSettings)

	const handleNextTab = () => setActiveTab(tab => tab + 1)
	const handlePreviousTab = () => setActiveTab(tab => tab - 1)

	const handleDone = async () => {
		try {
			const { campaignId, settings } = getSettings()
			if (campaignId == null) await createPrCampaign({ data: settings })
			else
				await editPrCampaign({
					campaign_id: campaignId,
					data: settings,
				})
			toast.success(`Кампания ${campaignId === null ? 'создана' : 'изменена'}`)
			navigate('/campaigns/pr')
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

			{activeTab == 0 && (
				<>
					<PrCampaignChatSettings />
					<PrCampaignLocationSettings />
				</>
			)}
			{activeTab == 1 && (
				<>
					<PrCampaignKeywordSettings />
					<PrCampaignCheckSettings />
				</>
			)}
			{activeTab == 2 && (
				<>
					<PrCampaignFunnelSettings />
				</>
			)}
			{activeTab == 3 && <PrCampaignLaunchSettings />}
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
					onClick={activeTab == tabs.length - 1 ? handleDone : handleNextTab}
					color={activeTab == tabs.length - 1 ? 'secondary' : 'primary'}
					disabled={tabs[activeTab + 1]?.disabled}
					variant='outlined'
					className='!rounded-full w-full'
				>
					{activeTab == tabs.length - 1 ? 'Сохранить' : 'Далее'}
				</Button>
			</div>
		</motion.form>
	)
}

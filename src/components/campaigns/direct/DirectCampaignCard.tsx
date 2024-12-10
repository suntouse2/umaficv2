import {
	useDeleteDirectCampaign,
	useEditDirectCampaign,
	useToggleDirectCampaign,
} from '@api/queries'
import ValueTuner from '@components/common/ValueTuner'
import Bubble from '@components/ui/Bubble'
import formatBalance from '@helpers/formatBalance'
import { Delete, SettingsOutlined, TextsmsOutlined } from '@mui/icons-material'
import { Badge, IconButton, Switch } from '@mui/material'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import DirectCampaignStatistics from './DirectCampaignStatistics'

type DirectCampaignCardProps = {
	campaign: TDirectCampaign
}

export default function DirectCampaignCard({ campaign }: DirectCampaignCardProps) {
	const { mutate: toggleCampaign, isPending } = useToggleDirectCampaign()
	const { mutate: editCampaign } = useEditDirectCampaign()
	const { mutate: deleteDirectCampaign } = useDeleteDirectCampaign()

	const navigate = useNavigate()

	const handleDeleteCampaign = () =>
		confirm('Вы точно хотите удалить кампанию?') &&
		deleteDirectCampaign({ id: campaign.id })

	const handleToggleCampaign = () =>
		!isPending &&
		toggleCampaign({
			id: campaign.id,
			action: campaign.state == 'active' ? 'stop' : 'start',
		})

	const handleUpdateBudget = (new_budget: string) => {
		editCampaign({
			id: campaign.id,
			settings: {
				budget_limit: new_budget,
			},
		})
	}
	const handleEditCampaign = () => navigate(`/campaigns/direct/edit/${campaign.id}`)
	const handleOpenChat = () => navigate(`/chat/${campaign.id}`)

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<Bubble className='p-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-bold'>{campaign.name}</h2>
					<div className='flex items-center'>
						<IconButton onClick={handleDeleteCampaign} color='success'>
							<Delete />
						</IconButton>
						<IconButton onClick={handleEditCampaign} color='success'>
							<SettingsOutlined />
						</IconButton>
						<IconButton onClick={handleOpenChat} color='success'>
							<Badge
								badgeContent={campaign.numeric_statistics.incoming_messages_unread}
								color='secondary'
							>
								<TextsmsOutlined />
							</Badge>
						</IconButton>
					</div>
				</div>
				<hr className='my-2 h-[1px] border-none bg-softgray' />
				{campaign.is_moderated ? (
					<div className='flex items-center justify-between'>
						<span className='text-md font-bold'>
							<span className='text-softgray4'>
								{campaign.state == 'inactive' && 'Не запущен'}
							</span>
							<span className='text-softgray3'>
								{campaign.state == 'pending' && 'Ожидание'}
								{campaign.state == 'preparing' && 'Подготовка'}
							</span>
							<span className='text-success'>
								{campaign.state == 'active' && 'Запущен'}
							</span>
						</span>
						{
							<Switch
								disabled={campaign.state == 'pending' || campaign.state == 'preparing'}
								size='small'
								color='success'
								checked={campaign.state == 'active'}
								onChange={handleToggleCampaign}
							/>
						}
					</div>
				) : (
					<div className='flex items-center justify-between'>
						<span className='text-warning font-bold'>На модерации</span>
					</div>
				)}
				<div className='flex mt-2 items-center justify-between'>
					<span>Бюджет кампании</span>
					<ValueTuner
						onlyDigits={true}
						minNumber={24}
						render={formatBalance(campaign.budget_limit)}
						value={campaign.budget_limit.toString()}
						onChange={handleUpdateBudget}
					/>
				</div>
				<hr className='my-2 h-[1px] border-none bg-softgray' />
				<DirectCampaignStatistics statistics={campaign.numeric_statistics} />
			</Bubble>
		</motion.div>
	)
}

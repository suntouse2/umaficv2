import { useDeletePrCampaign, useTogglePrCampaign } from '@api/queries'
import Bubble from '@components/ui/Bubble'
import formatBalance from '@helpers/formatBalance'
import { DeleteRounded, SettingsOutlined } from '@mui/icons-material'
import { IconButton, Switch } from '@mui/material'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

type PrCampaignCardProps = {
	campaign: TPRCampaign
}

export default function PrCampaignCard({ campaign }: PrCampaignCardProps) {
	const { mutate: deleteDirectCampaign } = useDeletePrCampaign()
	const { mutate: toggleCampaign, isPending } = useTogglePrCampaign()
	const navigate = useNavigate()

	const handleToggleCampaign = () =>
		!isPending &&
		toggleCampaign({
			id: campaign.id,
			action: campaign.state == 'active' ? 'stop' : 'start',
		})

	const handleDeleteCampaign = () =>
		confirm('Вы точно хотите удалить кампанию?') &&
		deleteDirectCampaign({ campaign_id: campaign.id })

	const handleEditCampaign = () => navigate(`/campaigns/pr/edit/${campaign.id}`)

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<Bubble className='p-4'>
				<div className='flex items-center justify-between'>
					<h2 className='flex items-center gap-2 text-lg font-bold'>
						{campaign.name}{' '}
						<span className='text-sm bg-softgray px-2 py-1 rounded-full'>
							#{campaign.id}
						</span>
					</h2>
					<div className='flex items-center'>
						<IconButton onClick={handleDeleteCampaign} color='success'>
							<DeleteRounded />
						</IconButton>
						<IconButton onClick={handleEditCampaign} color='success'>
							<SettingsOutlined />
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
					{formatBalance(campaign.budget_limit)}
				</div>
			</Bubble>
		</motion.div>
	)
}

import { useToggleDirectCampaign } from '@api/queries';
import Bubble from '@components/common/Bubble';
import formatBalance from '@helpers/formatBalance';
import { SettingsOutlined, TextsmsOutlined } from '@mui/icons-material';
import { Badge, IconButton, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type DirectCampaignCardProps = {
  campaign: TDirectCampaign;
};

export default function DirectCampaignCard({ campaign }: DirectCampaignCardProps) {
  const { mutate: toggleCampaign, isPending } = useToggleDirectCampaign();
  const navigate = useNavigate();

  const handleToggleCampaign = () => {
    if (isPending) return;
    toggleCampaign({ id: campaign.id, campaignState: campaign.state });
  };

  return (
    <Bubble className='p-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold'>{campaign.name}</h2>
        <div className='flex items-center'>
          <IconButton onClick={() => navigate('/campaigns/direct/edit', { state: { id: campaign.id } })} color='success'>
            <SettingsOutlined />
          </IconButton>
          <IconButton onClick={() => navigate('/chat', { state: { id: campaign.id } })} color='success'>
            <Badge badgeContent={campaign.numeric_statistics.incoming_messages_unread} color='secondary'>
              <TextsmsOutlined />
            </Badge>
          </IconButton>
        </div>
      </div>
      <hr className='my-2 h-[1px] border-none bg-softgray' />
      {campaign.is_moderated ? (
        <div className='flex items-center justify-between'>
          <span className='text-md'>
            {campaign.state == 'inactive' && 'Не запущен'}
            {campaign.state == 'pending' && 'Ожидание...'}
            {campaign.state == 'preparing' && 'Подготовка..'}
            {campaign.state == 'active' && 'Запущен'}
          </span>
          {<Switch disabled={campaign.state == 'pending' || campaign.state == 'preparing'} size='small' checked={campaign.state == 'active'} onChange={handleToggleCampaign} />}
        </div>
      ) : (
        <div className='flex items-center justify-between'>
          <span className='text-warning'>Ожидает модерации</span>
        </div>
      )}
      <hr className='my-2 h-[1px] border-none bg-softgray' />

      {/* Статистика */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Отправленных сообщений всего</span>
          <span className='text-sm'>{campaign.numeric_statistics.outgoing_auto_reply_messages}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Отправленных сообщений за сутки</span>
          <span className='text-sm'>{campaign.numeric_statistics.outgoing_auto_reply_messages_by_day}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Входящих сообщений всего</span>
          <span className='text-sm'>{campaign.numeric_statistics.incoming_messages}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Входящих сообщений за сутки</span>
          <span className='text-sm'>{campaign.numeric_statistics.incoming_messages_by_day}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Непрочитанных входящих сообщений</span>
          <span className='text-sm'>{campaign.numeric_statistics.incoming_messages_unread}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Избранных диалогов</span>
          <span className='text-sm'>{campaign.numeric_statistics.directs_favorite}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Общий расход</span>
          <span className='text-sm'>{formatBalance(campaign.numeric_statistics.spending)}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Расход за последние сутки</span>
          <span className='text-sm'>{formatBalance(campaign.numeric_statistics.spending_by_day)}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Общий возврат средств</span>
          <span className='text-sm'>{formatBalance(campaign.numeric_statistics.repayment)}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Возврат средств за последний день</span>
          <span className='text-sm'>{formatBalance(campaign.numeric_statistics.repayment_by_day)}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Средняя цена одного избранного/лида</span>
          <span className='text-sm'>{formatBalance((parseFloat(campaign.numeric_statistics.spending) / (campaign.numeric_statistics.directs_favorite || 1)).toFixed(0))}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm'>Средняя цена одного диалога</span>
          <span className='text-sm'>{formatBalance((parseFloat(campaign.numeric_statistics.spending) / (campaign.numeric_statistics.directs || 1)).toFixed(0))}</span>
        </div>
      </div>
    </Bubble>
  );
}

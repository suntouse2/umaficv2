import { useDeleteDirectCampaign, useEditDirectCampaign, useToggleDirectCampaign } from '@api/queries';
import Bubble from '@components/common/Bubble';
import ValueTuner from '@components/common/ValueTuner';
import formatBalance from '@helpers/formatBalance';
import { Delete, SettingsOutlined, TextsmsOutlined } from '@mui/icons-material';
import { Badge, IconButton, Switch } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type DirectCampaignCardProps = {
  campaign: TDirectCampaign;
};

export default function DirectCampaignCard({ campaign }: DirectCampaignCardProps) {
  const { mutate: toggleCampaign, isPending } = useToggleDirectCampaign();
  const { mutate: editCampaign } = useEditDirectCampaign();
  const { mutate: deleteDirectCampaign } = useDeleteDirectCampaign();

  const navigate = useNavigate();

  const handleDeleteCampaign = () => {
    if (confirm('Вы точно хотите удалить кампанию?')) deleteDirectCampaign({ id: campaign.id });
  };

  const handleToggleCampaign = () => {
    if (isPending) return;
    toggleCampaign({ id: campaign.id, campaignState: campaign.state });
  };

  const updateBudget = useCallback(
    (new_budget: string) => {
      editCampaign({
        id: campaign.id,
        data: {
          budget_limit: new_budget,
        },
      });
    },
    [campaign.id, editCampaign]
  );

  return (
    <>
      <Bubble className='p-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-bold'>{campaign.name}</h2>
          <div className='flex items-center'>
            <IconButton onClick={handleDeleteCampaign} color='success'>
              <Delete />
            </IconButton>
            <IconButton onClick={() => navigate('/campaigns/direct/edit', { state: { id: campaign.id } })} color='success'>
              <SettingsOutlined />
            </IconButton>
            <IconButton onClick={() => navigate(`/chat/${campaign.id}`)} color='success'>
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
        <div className='flex mt-2 items-center justify-between'>
          <span>Бюджет кампании</span>
          <ValueTuner type='number' value={formatBalance(campaign.budget_limit) ?? ''} onChange={(v) => updateBudget(v)} />
        </div>
        <hr className='my-2 h-[1px] border-none bg-softgray' />
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Отправленных сообщений (первое касание)</span>
            <span className='text-sm'>
              {campaign.numeric_statistics.directs}
              <span title='Отправленных в сутки' className='ml-1 bg-positive whitespace-nowrap px-1 text-sm rounded-sm bg-opacity-20'>
                + {campaign.numeric_statistics.directs_by_day}
              </span>
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Состоялось диалогов (второе касание)</span>
            <span className='text-sm'>
              {campaign.numeric_statistics.directs_interacted}{' '}
              <span title='Входящих в сутки' className='ml-1 whitespace-nowrap bg-positive px-1 text-sm rounded-sm bg-opacity-20'>
                + {campaign.numeric_statistics.directs_interacted_by_day}
              </span>
            </span>
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
            <span className='text-sm'>
              {formatBalance(campaign.numeric_statistics.spending)}
              <span title='Входящих в сутки' className='ml-1 whitespace-nowrap bg-positive px-1 text-sm rounded-sm bg-opacity-20'>
                + {campaign.numeric_statistics.spending_by_day}
              </span>
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Общий возврат средств</span>
            <span className='text-sm'>
              {formatBalance(campaign.numeric_statistics.repayment)}
              <span title='Входящих в сутки' className='ml-1 whitespace-nowrap bg-positive px-1 text-sm rounded-sm bg-opacity-20'>
                + {campaign.numeric_statistics.repayment_by_day}
              </span>
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Средняя цена одного избранного/лида</span>
            <span className='text-sm'>{campaign.numeric_statistics.directs_favorite < 1 ? '―' : formatBalance((parseFloat(campaign.numeric_statistics.spending) / (campaign.numeric_statistics.directs_favorite || 1)).toFixed(0))}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Средняя цена одного диалога</span>
            <span className='text-sm'>{campaign.numeric_statistics.directs_interacted < 1 ? '―' : formatBalance((parseFloat(campaign.numeric_statistics.spending) / campaign.numeric_statistics.directs_interacted).toFixed(0))}</span>
          </div>
        </div>
      </Bubble>
    </>
  );
}

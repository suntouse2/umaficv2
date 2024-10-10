import { useEditDirectCampaign, useToggleDirectCampaign } from '@api/queries';
import Bubble from '@components/common/Bubble';
import { Input } from '@components/common/Input';
import formatBalance from '@helpers/formatBalance';
import parseBudget from '@helpers/parseBudget';
import { Check, Edit, SettingsOutlined, TextsmsOutlined } from '@mui/icons-material';
import { Badge, IconButton, Popover, Switch } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type DirectCampaignCardProps = {
  campaign: TDirectCampaign;
};

export default function DirectCampaignCard({ campaign }: DirectCampaignCardProps) {
  const [budget, setBudget] = useState<string>(campaign.budget_limit.toString());
  const { mutate: toggleCampaign, isPending } = useToggleDirectCampaign();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mutateAsync: editCampaign } = useEditDirectCampaign();
  const navigate = useNavigate();

  const handleToggleCampaign = () => {
    if (isPending) return;
    toggleCampaign({ id: campaign.id, campaignState: campaign.state });
  };

  const openBudgetEdit = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeBudgetEditor = () => {
    setAnchorEl(null);
  };

  const updateBudget = async () => {
    try {
      await editCampaign({
        id: campaign.id,
        data: {
          budget_limit: budget,
        },
      });
      toast.success('Бюджет изменен');
    } catch {
      //
    }
  };

  return (
    <>
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
        <div className='flex mt-2 items-center justify-between'>
          <span>Бюджет кампании</span>
          <span className='flex items-center'>
            <div className='flex items-center'>
              {formatBalance(campaign.budget_limit)}
              <IconButton onClick={openBudgetEdit} size='small'>
                <Edit />
              </IconButton>
            </div>
          </span>
        </div>
        <hr className='my-2 h-[1px] border-none bg-softgray' />

        {/* Статистика */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Отправленных сообщений (первое касание)</span>
            <span className='text-sm'>
              {campaign.numeric_statistics.outgoing_auto_reply_messages}
              <span title='Отправленных в сутки' className='ml-1 bg-positive whitespace-nowrap px-1 text-sm rounded-sm bg-opacity-20'>
                + {campaign.numeric_statistics.outgoing_auto_reply_messages_by_day}
              </span>
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Состоялось диалогов (второе касание)</span>
            <span className='text-sm'>
              {campaign.numeric_statistics.incoming_messages}{' '}
              <span title='Входящих в сутки' className='ml-1 whitespace-nowrap bg-positive px-1 text-sm rounded-sm bg-opacity-20'>
                + {campaign.numeric_statistics.incoming_messages_by_day}
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
            <span className='text-sm'>Возврат средств за сутки</span>
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

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeBudgetEditor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <div>
          <Input onBlur={(e) => setBudget(parseBudget(e.target.value).toString())} value={budget.toString()} onChange={(e) => setBudget(e)} />
          <IconButton
            onClick={() => {
              updateBudget();
              closeBudgetEditor();
            }}
            color='success'>
            <Check />
          </IconButton>
        </div>
      </Popover>
    </>
  );
}

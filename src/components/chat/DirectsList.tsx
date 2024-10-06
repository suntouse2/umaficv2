import { useState } from 'react';
import { useDeleteDirect, useFetchChatDirects, useUpdateDirect } from '@api/queries';
import { useChat } from '@context/ChatContext';
import uniqolor from 'uniqolor';
import { Avatar, LinearProgress, Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import dateToString from '@helpers/dateToString';
import { shortText } from '@helpers/shortText';
import mediaToText from '@helpers/mediaToText';

export default function DirectsList() {
  const { campaignId, currentDirect, setCurrentDirect } = useChat();
  const { mutate: updateDirect } = useUpdateDirect();
  const { mutate: deleteDirect } = useDeleteDirect();
  const [filter, setFilter] = useState<{ is_open?: boolean; is_favorite?: boolean }>({});
  const { data, isFetching } = useFetchChatDirects(campaignId, filter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuDirect, setCurrentMenuDirect] = useState<TChatDirect | null>(null);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null); // For long press

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, direct: TChatDirect) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setCurrentMenuDirect(direct);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenuDirect(null);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>, direct: TChatDirect) => {
    const timer = setTimeout(() => handleMenuOpen(event, direct), 500);
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: uniqolor(name.toUpperCase(), { lightness: 40, saturation: 100 }).color,
      },
      children: `${name[0]}`,
    };
  }

  const handleFavoriteChange = () => {
    const direct = currentMenuDirect;
    if (!direct) return;
    updateDirect({ campaign_id: campaignId, direct_id: direct.id, data: { is_favorite: !direct.is_favorite } });
    setAnchorEl(null);
    setCurrentMenuDirect(null);
  };

  const handleDirectClick = ({ is_open, id }: TChatDirect) => {
    if (!is_open) updateDirect({ campaign_id: campaignId, direct_id: id, data: { is_open: true } });
    setCurrentDirect(id);
  };

  const handleDeleteDirect = () => {
    const direct = currentMenuDirect;
    if (!direct) return;
    deleteDirect({ direct_id: direct.id });
  };

  return (
    <div className='p-2 mt-2 border-r-[1px] h-full border-softgray w-full min-w-[300px]'>
      <ToggleButtonGroup
        color='secondary'
        className='mb-2 !w-full'
        value={filter['is_favorite'] ? 'favorite' : 'all'}
        exclusive
        onChange={(_v, v) =>
          setFilter((e) => ({
            ...e,
            is_favorite: v === 'favorite' ? true : undefined,
          }))
        }
        aria-label='Platform'>
        <ToggleButton className='w-full' value='all'>
          Все
        </ToggleButton>
        <ToggleButton className='w-full' value='favorite'>
          Избранное
        </ToggleButton>
      </ToggleButtonGroup>
      <ul className='flex flex-col h-full w-full'>
        {!data && isFetching && <LinearProgress color='secondary' />}
        {data &&
          data.pages.length > 0 &&
          data.pages.map((directs) =>
            directs.data.map((direct) => (
              <li title='Нажмите правой кнопкой' onClick={() => handleDirectClick(direct)} onContextMenu={(e) => handleMenuOpen(e, direct)} onTouchStart={(e) => handleTouchStart(e, direct)} onTouchEnd={handleTouchEnd} key={direct.id} className={`flex gap-3 p-2 w-full transition-colors hover:bg-softgray cursor-pointer ${currentDirect === direct.id && '!bg-softgray'}`}>
                <Avatar {...stringAvatar(direct.user.first_name)} />
                <div className='w-full'>
                  <p className='flex justify-between gap-5'>
                    <b>{direct.user.first_name + ' ' + (direct.user.last_name ?? '')}</b> {direct.last_message && <span className='text-sm text-softgray4'>{dateToString(new Date(direct.last_message.date))}</span>}
                  </p>
                  <p>{direct.last_message.content.message && shortText(direct.last_message.content.message, 50)}</p>
                  <p>{direct.last_message.content.media && mediaToText(direct.last_message.content.media.type)}</p>
                </div>
                {direct.unread_count > 0 && (
                  <div className='flex h-full items-center'>
                    <div className='bg-secondary  w-6 h-6 text-sm rounded-full flex justify-center items-center text-white '>{direct.unread_count}</div>
                  </div>
                )}
              </li>
            ))
          )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleFavoriteChange}>{currentMenuDirect?.is_favorite ? 'Удалить из избранных' : 'Добавить в избранное'}</MenuItem>
          <MenuItem onClick={handleDeleteDirect}>Удалить диалог</MenuItem>
        </Menu>
      </ul>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useFetchChatDirects, useUpdateDirect } from '@api/queries';
import { useChat } from '@context/ChatContext';
import { Avatar, LinearProgress, Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import dateToString from '@helpers/dateToString';
import mediaToText from '@helpers/mediaToText';
import { useInView } from 'react-intersection-observer';
import { stringAvatar } from '@helpers/stringAvatar';

export default function DirectsList() {
  const { campaignId, currentDirect, setCurrentDirect } = useChat();
  const { mutate: updateDirect } = useUpdateDirect();
  const [filter, setFilter] = useState<{ is_open?: boolean; is_favorite?: boolean }>({});
  const { data, isFetching, fetchNextPage } = useFetchChatDirects(campaignId, filter);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenuDirect, setCurrentMenuDirect] = useState<TChatDirect | null>(null);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null); // For long press
  const { ref, inView } = useInView();
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

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

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

  // const handleDeleteDirect = () => {
  //   const direct = currentMenuDirect;
  //   if (!direct) return;
  //   deleteDirect({ direct_id: direct.id });
  // };

  return (
    <div className='flex flex-col  border-r-[1px] h-full overflow-hidden border-softgray w-full min-w-[400px] lg:max-w-[400px] '>
      <ToggleButtonGroup
        color='primary'
        className='!w-full '
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

      <ul className='relative flex flex-col py-2 h-full w-full overflow-x-hidden overflow-y-auto'>
        {!data && isFetching && <LinearProgress color='primary' />}
        {data && data.pages.length > 0 && (
          <>
            {data.pages.map((directs) =>
              directs.data.map((direct) => (
                <li onClick={() => handleDirectClick(direct)} onContextMenu={(e) => handleMenuOpen(e, direct)} onTouchStart={(e) => handleTouchStart(e, direct)} onTouchEnd={handleTouchEnd} key={direct.id} className={`flex popup gap-3 p-2 w-full min-h-20 max-h-20  hover:bg-softgray cursor-pointer ${currentDirect === direct.id && '!bg-primary !bg-opacity-10'}`}>
                  <Avatar {...stringAvatar(direct.user.first_name)} />
                  <div className='w-full overflow-hidden'>
                    <p className='flex justify-between gap-5 w-full overflow-hidden'>
                      <b className='whitespace-nowrap'>{direct.user.first_name + ' ' + (direct.user.last_name ?? '')}</b> {direct.last_message && <span className='text-sm whitespace-nowrap text-softgray4'>{dateToString(new Date(direct.last_message.date))}</span>}
                    </p>
                    <p className='whitespace-nowrap w-full overflow-hidden text-ellipsis'>
                      {direct.last_message?.content?.message}
                      {direct.last_message?.content?.media && mediaToText(direct.last_message.content.media.type)}
                    </p>
                  </div>
                  {direct.unread_count > 0 && (
                    <div className='flex h-full items-center'>
                      <div className='bg-secondary min-w-6 w-auto h-6 p-1 text-sm rounded-full flex justify-center items-center text-white '>{direct.unread_count}</div>
                    </div>
                  )}
                </li>
              ))
            )}
            <div ref={ref}></div>
          </>
        )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleFavoriteChange}>{currentMenuDirect?.is_favorite ? 'Удалить из избранных' : 'Добавить в избранное'}</MenuItem>
        </Menu>
      </ul>
    </div>
  );
}

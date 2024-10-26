import { useNavigate } from 'react-router-dom';
import Direct from '@components/chat/Direct';
import { Virtuoso } from 'react-virtuoso';
import { useChat } from '@context/chat/ChatContext';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

export default function DirectsList() {
  const { isFavorite, directs, setIsFavorite, fetchNextDirects, campaignId, openDirect } = useChat();

  const navigate = useNavigate();

  const handleDirectClick = ({ id }: TChatDirect) => {
    if (directs.find((direct) => direct.id == id)?.is_open == false) {
      openDirect(id);
    }
    navigate(`/chat/${campaignId}/${id}`);
  };

  return (
    <div className='flex flex-col border-r-[1px] h-full overflow-hidden border-softgray w-full min-w-[400px] lg:max-w-[400px] '>
      <div className='flex justify-center flex-col h-[72px] px-2'>
        <ToggleButtonGroup
          color='primary'
          className='!w-full'
          value={isFavorite ? 'favorite' : 'all'}
          exclusive
          onChange={(_v, v) => {
            if (v == 'favorite') {
              setIsFavorite(true);
            } else if (v == 'all') {
              setIsFavorite(false);
            }
          }}
          aria-label='Platform'>
          <ToggleButton className='w-full' value='all'>
            Все
          </ToggleButton>
          <ToggleButton className='w-full' value='favorite'>
            Избранное
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        className='chatScroll'
        data={directs}
        itemContent={(_index, direct) => <Direct onClick={() => handleDirectClick(direct)} direct={direct} />}
        endReached={() => {
          fetchNextDirects();
        }}
        increaseViewportBy={{ top: 0, bottom: 200 }}
      />
    </div>
  );
}

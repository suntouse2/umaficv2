import { useState } from 'react';
import { useFetchChatDirects, useUpdateDirect } from '@api/queries';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Direct from '@components/chat/Direct';
import { Virtuoso } from 'react-virtuoso';

export default function DirectsList() {
  const params = useParams();
  const navigate = useNavigate();
  const campaignId = Number(params.campaignId);

  const { mutate: updateDirect } = useUpdateDirect();
  const [filter, setFilter] = useState<{ is_open?: boolean; is_favorite?: boolean }>({});
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchChatDirects(campaignId, filter);

  const directs = data?.pages.flatMap((direct) => direct.data) || [];

  const handleDirectClick = ({ is_open, id }: TChatDirect) => {
    if (!is_open) updateDirect({ campaign_id: campaignId, direct_id: id, data: { is_open: true } });
    navigate(`${id}`, { relative: 'path' });
  };

  return (
    <div className='flex flex-col border-r-[1px] h-full overflow-hidden border-softgray w-full min-w-[400px] lg:max-w-[400px] '>
      <div className='flex justify-center flex-col h-[72px] px-2'>
        <ToggleButtonGroup
          color='primary'
          className='!w-full'
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
      </div>
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        className='chatScroll'
        data={directs}
        itemContent={(_index, direct) => <Direct onClick={() => handleDirectClick(direct)} direct={direct} />}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </div>
  );
}

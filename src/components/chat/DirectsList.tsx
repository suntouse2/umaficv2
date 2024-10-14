import { useEffect, useState } from 'react';
import { useFetchChatDirects, useUpdateDirect } from '@api/queries';
import { LinearProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';
import Direct from '@components/chat/Direct';

export default function DirectsList() {
  const params = useParams();
  const navigate = useNavigate();
  const campaignId = Number(params.campaignId);

  const { mutate: updateDirect } = useUpdateDirect();
  const [filter, setFilter] = useState<{ is_open?: boolean; is_favorite?: boolean }>({});
  const { data, isFetching, fetchNextPage } = useFetchChatDirects(campaignId, filter);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

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
      <ul className='relative flex flex-col h-full w-full overflow-x-hidden overflow-y-auto'>
        {!data && isFetching && <LinearProgress color='primary' />}
        {data && data.pages.length > 0 && (
          <>
            {data.pages.map((directs) =>
              directs.data.map((direct) => (
                <li key={direct.id}>
                  <Direct direct={direct} onClick={() => handleDirectClick(direct)} />
                </li>
              ))
            )}
            <div ref={ref}></div>
          </>
        )}
      </ul>
    </div>
  );
}

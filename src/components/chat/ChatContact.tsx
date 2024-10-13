import { useFetchDirect, useUpdateDirect } from '@api/queries';
import { useChat } from '@context/ChatContext';
import { stringAvatar } from '@helpers/stringAvatar';
import { Favorite } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';

export default function ChatContact() {
  const { currentDirect, campaignId } = useChat();

  const { data } = useFetchDirect(currentDirect ?? 0);
  const { mutate: updateDirect } = useUpdateDirect();

  const handleFavoriteChange = () => {
    if (!data) return;
    if (!currentDirect) return;
    updateDirect({ campaign_id: campaignId, direct_id: currentDirect, data: { is_favorite: !data.is_favorite } });
  };

  return (
    <div className='w-full lg:mt-7 h-20 flex items-center gap-2 p-2 border-b-[1px] border-softgray'>
      {data && (
        <div className='flex justify-between w-full gap-2'>
          <a target='_blank' href={data.user.link} className='flex items-center gap-2'>
            <Avatar {...stringAvatar(data.user.first_name)} />
            <div className='flex flex-col'>
              <b className='whitespace-nowrap'>{data.user.first_name + ' ' + (data.user.last_name ?? '')}</b>
              <span className='text-[13px]'>{data.user.id}</span>
            </div>
          </a>
          <IconButton onClick={handleFavoriteChange} color={data.is_favorite ? 'error' : 'default'}>
            <Favorite />
          </IconButton>
        </div>
      )}
    </div>
  );
}

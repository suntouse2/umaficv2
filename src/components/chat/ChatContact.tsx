import { useFetchDirect, useUpdateDirect } from '@api/queries';

import { stringAvatar } from '@helpers/stringAvatar';
import { Favorite } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ChatContact() {
  const params = useParams();
  const campaignId = Number(params.campaignId);
  const directId = Number(params.directId);
  const { data: direct } = useFetchDirect(directId);
  const { mutate: updateDirect } = useUpdateDirect();

  const client = direct?.user;
  const isFavorite = direct?.is_favorite;

  const handleFavoriteChange = () => {
    updateDirect({ campaign_id: campaignId, direct_id: directId, data: { is_favorite: !isFavorite } });
  };

  return (
    <div className='w-full h-20 flex items-center gap-2 p-2 border-b-[1px] border-softgray'>
      {client && (
        <div className='flex justify-between w-full gap-2'>
          <a target='_blank' href={client.link} className='flex items-center gap-2'>
            <Avatar {...stringAvatar(client.first_name)} />
            <div className='flex flex-col'>
              <b className='whitespace-nowrap'>{client.first_name + ' ' + (client.last_name ?? '')}</b>
              <span className='text-[13px]'>{client.id}</span>
            </div>
          </a>
          <IconButton onClick={handleFavoriteChange} color={isFavorite ? 'error' : 'default'}>
            <Favorite />
          </IconButton>
        </div>
      )}
    </div>
  );
}

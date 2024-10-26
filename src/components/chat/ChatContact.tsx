import { useChat } from '@context/chat/ChatContext';
import { stringAvatar } from '@helpers/stringAvatar';
import { Favorite } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';

export default function ChatContact() {
  const { currentDirect, setDirectFavorite } = useChat();

  const client = currentDirect?.user;
  const isFavorite = currentDirect?.is_favorite;

  const handleFavoriteChange = async () => {
    if (!currentDirect) return;
    await setDirectFavorite(currentDirect.id, !isFavorite);
    // updateDirect({ campaign_id: campaignId, direct_id: directId, data: { is_favorite: !isFavorite } });
  };

  return (
    <div className='w-full h-20 flex items-center gap-2 p-2 border-b-[1px] border-softgray'>
      {client && (
        <div className='flex w-full gap-4'>
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

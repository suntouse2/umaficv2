import { useFetchDirect } from '@api/queries';
import { useChat } from '@context/ChatContext';
import { stringAvatar } from '@helpers/stringAvatar';
import { Avatar } from '@mui/material';

export default function ChatContact() {
  const { currentDirect } = useChat();

  const { data } = useFetchDirect(currentDirect ?? 0);

  return (
    <div className='w-full h-20 flex items-center gap-2 p-2 border-b-[1px] border-softgray'>
      {data && (
        <>
          <Avatar {...stringAvatar(data.user.first_name)} />
          <b className='whitespace-nowrap'>{data.user.first_name + ' ' + (data.user.last_name ?? '')}</b>
        </>
      )}
    </div>
  );
}

import dateToString from '@helpers/dateToString';
import mediaToText from '@helpers/mediaToText';
import { stringAvatar } from '@helpers/stringAvatar';
import { AccessTime } from '@mui/icons-material';
import { Avatar, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

type DirectProps = {
  direct: TChatDirect;
  onClick: () => void;
};

export default function Direct({ direct, onClick }: DirectProps) {
  const params = useParams();
  const directId = Number(params.directId);

  const isUnRead = direct.unread_count > 0;

  return (
    <Button onClick={onClick} key={direct.id} className={`flex text-left gap-3 p-2 w-full min-h-20 max-h-20  hover:bg-softgray cursor-pointer ${Number(directId) == direct.id && '!bg-primary !bg-opacity-10'}`}>
      <Avatar {...stringAvatar(direct.user.first_name)} />
      <div className='w-full overflow-hidden'>
        <p className='flex justify-between gap-5 w-full overflow-hidden'>
          <b className={`whitespace-nowrap text-dark ${isUnRead && '!text-primary'}`}>{direct.user.first_name + ' ' + (direct.user.last_name ?? '')}</b> {direct.last_message && <span className='text-sm whitespace-nowrap text-softgray4'>{direct.last_message.date ? dateToString(new Date(direct.last_message.date)) : <AccessTime className='!text-sm' />}</span>}
        </p>
        {(!direct.last_message?.content?.message || !direct.last_message?.content?.media) && (
          <p className={`whitespace-nowrap ${isUnRead && '!text-primary'} text-dark w-full overflow-hidden text-ellipsis`}>
            {direct.last_message?.forwarded_message?.content?.message}
            {direct.last_message?.forwarded_message?.content?.media && mediaToText(direct.last_message.forwarded_message.content.media.type)}
          </p>
        )}
        <p className={`whitespace-nowrap ${isUnRead && '!text-primary'} text-dark w-full overflow-hidden text-ellipsis`}>
          {direct.last_message?.content?.message}
          {direct.last_message?.content?.media && mediaToText(direct.last_message.content.media.type)}
        </p>
      </div>
      {isUnRead && (
        <div className='flex h-full items-center'>
          <div className='bg-primary min-w-6 w-auto h-6 p-1 text-sm rounded-full flex justify-center items-center text-white '>{direct.unread_count}</div>
        </div>
      )}
    </Button>
  );
}

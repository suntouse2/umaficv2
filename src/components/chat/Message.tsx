import { useSetLastMessageRead } from '@api/queries';
import MediaRenderer from '@components/MediaRenderer';
import dateToString from '@helpers/dateToString';
import { useEffect } from 'react';
import './chat.css';
import { useParams } from 'react-router-dom';

export default function Message({ message }: { message: TChatMessage }) {
  const params = useParams();
  const campaignId = Number(params.campaignId);
  const directId = Number(params.directId);

  const { mutate: readLastMessage } = useSetLastMessageRead();
  const isSelf = 'relative bg-primary text-white rounded-lg messageSelf';
  const isFrom = 'relative bg-white rounded-lg  messageFrom';

  useEffect(() => {
    if (message.is_read == false) {
      readLastMessage({ campaign_id: campaignId, direct_id: directId, message_id: message.id });
    }
  }, [campaignId, directId, message.id, message.is_read, readLastMessage]);

  return (
    <div className={`flex w-full ${message.is_self ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
      <div className={`flex flex-col ${message.is_self ? 'items-end' : 'items-start'}`}>
        {message.forwarded_message?.content && (
          <div className={`p-2  max-w-[320px] ${message.is_self ? isSelf : isFrom}`}>
            <i>Пересланное сообщение:</i>
            <p className='w-full'>{message.forwarded_message.content.message}</p>
            {message.forwarded_message.content.media && <MediaRenderer media={message.forwarded_message.content.media} />}
          </div>
        )}
        {message.content.message && (
          <div className={`p-2  max-w-[320px] ${message.is_self ? isSelf : isFrom}`}>
            <p className='w-full'>{message.content.message}</p>
          </div>
        )}
        {message.content.media && (
          <div className={`p-2 max-w-[320px] mt-2`}>
            <MediaRenderer media={message.content.media} />
          </div>
        )}
        <div className='text-[12px] opacity-50'>{dateToString(new Date(message.date))}</div>
      </div>
    </div>
  );
}

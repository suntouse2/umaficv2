import { useSetLastMessageRead } from '@api/queries';
import MediaRenderer from '@components/MediaRenderer';
import { useChat } from '@context/ChatContext';
import dateToString from '@helpers/dateToString';
import { useEffect } from 'react';

export default function Message({ message }: { message: TChatMessage }) {
  const { campaignId, currentDirect } = useChat();
  const { mutate: readLastMessage } = useSetLastMessageRead();
  const isSelf = 'bg-primary text-white ';
  const isFrom = 'bg-softgray';

  useEffect(() => {
    if (!currentDirect) return;
    if (message.is_read == false) {
      readLastMessage({ campaign_id: campaignId, direct_id: currentDirect, message_id: message.id });
    }
  }, [campaignId, currentDirect, message.id, message.is_read, readLastMessage]);

  return (
    <div className={`flex  w-full ${message.is_self ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
      <div className={`flex flex-col ${message.is_self ? 'items-end' : 'items-start'}`}>
        <div className={`p-2 rounded w-max ${message.is_self ? isSelf : isFrom}`}>
          {message.forwarded_message && (
            <div className='flex flex-col bg-primary bg-opacity-10 p-2'>
              <i className='text-sm'>Пересланное сообщение:</i>
              {message.forwarded_message.content.message}
              {message.forwarded_message.content.media && <MediaRenderer media={message.content.media} />}
            </div>
          )}
          {message.content.message}
          {message.content.media && <MediaRenderer media={message.content.media} />}
        </div>
        <div className='text-[12px] opacity-50'>{dateToString(new Date(message.date))}</div>
      </div>
    </div>
  );
}

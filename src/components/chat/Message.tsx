import MediaRenderer from '@components/MediaRenderer';
import dateToString from '@helpers/dateToString';
import React, { useEffect } from 'react';
import ReactLinkify from 'react-linkify';
import { AccessTime } from '@mui/icons-material';
import { useChat } from '@context/chat/ChatContext';

export default function Message({ message }: { message: TChatMessage }) {
  const { campaignId, directId, readMessage } = useChat();

  const isSelf = 'relative bg-primary text-white rounded-lg messageSelf';
  const isFrom = 'relative bg-white rounded-lg messageFrom';

  useEffect(() => {
    if (message.is_read == false) {
      if (!directId) return;
      readMessage(directId, message.id);
    }
  }, [campaignId, directId, message, message.id, message.is_read, readMessage]);

  const linkDecorator = (href: string, text: string, key?: React.Key | null) => (
    <a className={`underline ${message.is_self ? 'text-white' : 'text-primary'}`} href={href} key={key} target='_blank' rel='noopener noreferrer'>
      {text}
    </a>
  );

  return (
    <div className={`flex w-full ${message.is_self ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
      <div className={`flex flex-col ${message.is_self ? 'items-end' : 'items-start'} ${message.date ? '' : 'opacity-50'}`}>
        {message.forwarded_message?.content && (
          <div className={`p-2 max-w-[320px] ${message.is_self ? isSelf : isFrom}`}>
            <i>Пересланное сообщение:</i>
            <ReactLinkify componentDecorator={linkDecorator}>
              <p className='w-full'>{message.forwarded_message.content.message}</p>
            </ReactLinkify>
            {message.forwarded_message.content.media && <MediaRenderer media={message.forwarded_message.content.media} />}
          </div>
        )}
        {message.content.message && (
          <div className={`p-2 max-w-[320px] ${message.is_self ? isSelf : isFrom}`}>
            <ReactLinkify componentDecorator={linkDecorator}>
              <p className='w-full overflow-hidden break-words'>{message.content.message}</p>
            </ReactLinkify>
          </div>
        )}
        {message.content.media && (
          <div className={`p-2 max-w-[320px] mt-2`}>
            <MediaRenderer media={message.content.media} />
          </div>
        )}
        <div className={`text-[12px] opacity-50`}>{message.date ? dateToString(new Date(message.date)) : <AccessTime className='!text-sm' />}</div>
      </div>
    </div>
  );
}

import MediaRenderer from '@components/MediaRenderer';

export default function Message({ message }: { message: TChatMessage }) {
  const isSelf = 'bg-primary text-white ';
  const isFrom = 'bg-softgray';

  return (
    <div className={`flex w-full ${message.is_self ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-2 rounded w-max ${message.is_self ? isSelf : isFrom}`}>
        {message.forwarded_message && (
          <div className='flex flex-col bg-primary bg-opacity-10 p-2'>
            <i className='text-sm'>Пересланное сообщение:</i>
            {message.forwarded_message.content.message}
          </div>
        )}
        {message.content.message}
        {message.content.media && <MediaRenderer media={message.content.media} />}
      </div>
    </div>
  );
}

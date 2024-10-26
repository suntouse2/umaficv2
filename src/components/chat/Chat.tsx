import Message from '@components/chat/Message';
import { Virtuoso } from 'react-virtuoso';

import { useChat } from '@context/chat/ChatContext';

export default function Chat() {
  const { messages, fetchNextMessages } = useChat();

  const INITIAL_ITEM_COUNT = 10000;

  const firstItemIndex = INITIAL_ITEM_COUNT - messages.length;

  return (
    <section className='flex flex-col w-full p-5 h-full overflow-hidden bg-primary bg-opacity-10'>
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        className='chatScroll'
        data={messages}
        firstItemIndex={firstItemIndex}
        itemContent={(_index, message) => <Message message={message} />}
        startReached={() => {
          fetchNextMessages();
        }}
        initialTopMostItemIndex={messages.length - 1}
        followOutput='auto'
        increaseViewportBy={{ top: 500, bottom: 0 }}
      />
    </section>
  );
}

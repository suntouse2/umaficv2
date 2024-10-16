import { useFetchDirectMessages } from '@api/queries';
import Message from '@components/chat/Message';
import { Virtuoso } from 'react-virtuoso';
import { useParams } from 'react-router-dom';

export default function Chat() {
  const params = useParams();
  const directId = Number(params.directId);

  const INITIAL_ITEM_COUNT = 10000;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchDirectMessages(directId);

  const messages = data?.pages.flatMap((msg) => msg) || [];

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
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        initialTopMostItemIndex={messages.length - 1}
        followOutput='auto'
        increaseViewportBy={{ top: 500, bottom: 0 }}
      />
    </section>
  );
}

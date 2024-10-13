import { useFetchDirectMessages } from '@api/queries';
import Message from '@components/chat/Message';
import MediaRenderer from '@components/MediaRenderer';
import { useChat } from '@context/ChatContext';
import { AccessTimeOutlined, StraightRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export default function ChatScreen() {
  const { currentDirect, messagesQueue } = useChat();
  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } = useFetchDirectMessages(currentDirect ?? 0);
  const ref = useRef<HTMLUListElement | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const currentScrollPosition = ref.current.scrollTop;
      const isAtTop = currentScrollPosition === 0;

      if (isAtTop && hasNextPage && !isFetchingNextPage) {
        setShowLoadMore(true);
      } else {
        setShowLoadMore(false);
      }
    };

    const scrollElement = ref.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!ref.current) return;
    const currentScrollPosition = ref.current.scrollTop;
    const totalHeight = ref.current.scrollHeight;
    const visibleHeight = ref.current.clientHeight;
    const isInBottomHalf = currentScrollPosition + visibleHeight >= totalHeight / 2;

    if (isInBottomHalf) {
      const timeout = setTimeout(() => {
        ref.current!.scrollTop = ref.current!.scrollHeight;
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [data, messagesQueue, isFetchingNextPage]);

  return (
    <section className='flex flex-col w-full p-5 h-full overflow-hidden bg-primary bg-opacity-10'>
      <div className='flex items-center w-full justify-center'>
        {hasNextPage && showLoadMore && (
          <Button size='small' disabled={isFetching} onClick={() => fetchNextPage()} color='primary'>
            {isFetching ? (
              <>Загрузка...</>
            ) : (
              <>
                Загрузить еще <StraightRounded />
              </>
            )}
          </Button>
        )}
      </div>
      <ul ref={ref} className='flex flex-col gap-2 w-full overflow-auto'>
        {data && data.pages && data.pages.length > 0 && data.pages.map((page) => page.map((msg) => <Message key={msg.id} message={msg} />))}
        {messagesQueue
          .filter((msg) => msg.direct_id == currentDirect)
          .map((msg, ind) => (
            <li key={ind} className='flex opacity-50 flex-col w-full justify-end items-end'>
              <div>
                <div className='flex flex-col items-end justify-end '>
                  {msg.content.message && <div className='bg-primary flex flex-col text-white p-2 rounded-md w-max'>{msg.content.message}</div>}
                  {msg.content.media && (
                    <div className={`p-2 max-w-[320px] mt-2`}>
                      <MediaRenderer media={msg.content.media} />
                    </div>
                  )}
                </div>
              </div>
              <div className='opacity-50'>
                <AccessTimeOutlined className='!text-[15px]' />
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}

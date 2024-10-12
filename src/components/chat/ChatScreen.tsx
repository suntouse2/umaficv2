import { useFetchDirectMessages } from '@api/queries';
import Message from '@components/chat/Message';
import { useChat } from '@context/ChatContext';
import { AccessTimeOutlined, StraightRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useRef } from 'react';

export default function ChatScreen() {
  const { currentDirect, messagesQueue } = useChat();
  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } = useFetchDirectMessages(currentDirect ?? 0);
  const ref = useRef<HTMLUListElement | null>(null);

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
        {hasNextPage && (
          <Button disabled={isFetching} onClick={() => fetchNextPage()} color='primary'>
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
      <ul ref={ref} className='flex flex-col gap-2 w-full h-full overflow-auto'>
        {data && data.pages && data.pages.length > 0 && data.pages.map((page) => page.map((msg) => <Message key={msg.id} message={msg} />))}
        {messagesQueue
          .filter((msg) => msg.direct_id == currentDirect)
          .map((msg, ind) => (
            <li key={ind} className='flex flex-col w-full justify-end items-end'>
              <div>
                <div className='flex justify-end '>
                  <div className='bg-secondary flex flex-col  text-white p-2 rounded-md w-max'>{msg.content.message}</div>
                </div>
              </div>
              <div className='opacity-50'>
                <AccessTimeOutlined className='!text-[18px]' />
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}

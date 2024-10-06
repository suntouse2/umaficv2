import { useFetchDirectMessages } from '@api/queries';
import Message from '@components/chat/Message';
import { useChat } from '@context/ChatContext';
import { AccessTimeOutlined, StraightRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export default function ChatScreen() {
  const { currentDirect, messagesQueue } = useChat();
  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } = useFetchDirectMessages(currentDirect ?? 0);
  const ref = useRef<HTMLUListElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  const handleScroll = () => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    setShouldScroll(scrollHeight - (scrollTop + clientHeight) <= 200);
  };

  useEffect(() => {
    if (!ref.current) return;

    if (shouldScroll) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [data, messagesQueue, isFetchingNextPage, shouldScroll]);

  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <section className='flex flex-col w-full p-5 h-full overflow-hidden '>
      <div className='flex items-center w-full justify-center'>
        {hasNextPage && (
          <Button disabled={isFetching} onClick={() => fetchNextPage()} color='secondary'>
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

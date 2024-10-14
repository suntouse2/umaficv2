import { useFetchDirectMessages } from '@api/queries';
import Message from '@components/chat/Message';
import { StraightRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './chat.css';

export default function Chat() {
  const params = useParams();
  const directId = Number(params.directId);

  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } = useFetchDirectMessages(directId);

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
  }, [data, isFetchingNextPage]);

  return (
    <section className='flex flex-col w-full p-5 h-full overflow-hidden bg-primary bg-opacity-10'>
      <div className='flex items-center w-full justify-center'>
        {hasNextPage && showLoadMore && (
          <Button size='small' disabled={isFetching} onClick={() => fetchNextPage()} color='primary'>
            Загрузить еще <StraightRounded />
          </Button>
        )}
      </div>
      <ul ref={ref} className='chatScroll flex flex-col gap-2 w-full overflow-auto'>
        {data && data.pages && data.pages.length > 0 && data.pages.map((page) => page.map((msg) => <Message key={msg.id} message={msg} />))}
      </ul>
    </section>
  );
}

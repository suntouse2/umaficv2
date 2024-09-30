import { useFetchDirectMessages } from '@api/queries';
import Message from '@components/chat/Message';
import { useChat } from '@context/ChatContext';

export default function ChatScreen() {
  const { currentDirect } = useChat();
  const { data } = useFetchDirectMessages(currentDirect ?? 0);

  return (
    <section className='w-full p-5 h-full'>
      <ul className='flex flex-col gap-2 w-full'>{data && data.pages.length > 0 && data.pages.map((page) => page.map((msg) => <Message message={msg} />))}</ul>
    </section>
  );
}

import Chat from '@components/chat/Chat';
import ChatContact from '@components/chat/ChatContact';
import ChatInput from '@components/chat/ChatInput';

export default function ChatScreen() {
  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <ChatContact />
      <Chat />
      <ChatInput />
    </div>
  );
}

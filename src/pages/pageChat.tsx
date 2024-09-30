import ChatScreen from '@components/chat/ChatScreen';
import DirectsList from '@components/chat/DirectsList';
import MessageInput from '@components/chat/MessageInput';
import AuthWrapper from '@components/wrappers/AuthWrapper';
import MainLayout from '@components/wrappers/layouts/MainLayout';
import { ChatProvider } from '@context/ChatContext';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PageChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  useEffect(() => {
    if (!id) return navigate('/campaigns/direct');
  }, [id, navigate]);

  return (
    <section>
      <AuthWrapper>
        <MainLayout>
          <ChatProvider id={id}>
            <div className='h-full w-full grid grid-cols-[max-content,1fr]'>
              <DirectsList />
              <div className='flex flex-col'>
                <ChatScreen />
                <MessageInput />
              </div>
            </div>
          </ChatProvider>
        </MainLayout>
      </AuthWrapper>
    </section>
  );
}

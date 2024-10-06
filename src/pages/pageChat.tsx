import ChatLayout from '@components/chat/ChatLayout';
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
            <ChatLayout />
          </ChatProvider>
        </MainLayout>
      </AuthWrapper>
    </section>
  );
}

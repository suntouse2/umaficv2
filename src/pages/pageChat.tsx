import ChatLayout from '@components/chat/ChatLayout';
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
    <ChatProvider id={id}>
      <ChatLayout />
    </ChatProvider>
  );
}

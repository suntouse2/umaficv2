import ChatContact from '@components/chat/ChatContact';
import ChatScreen from '@components/chat/ChatScreen';
import DirectsList from '@components/chat/DirectsList';
import MessageInput from '@components/chat/MessageInput';
import { useChat } from '@context/ChatContext';
import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatLayout() {
  const { currentDirect, setCurrentDirect, campaignId, removeMessageFromQueue } = useChat();
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    if (campaignId == null) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/directs/messages?campaign_id=${campaignId}&token=${localStorage.getItem('access_token')}`);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Соединение открыто');
    };

    ws.onclose = () => {
      console.log('Соединение закрыто');
    };

    ws.onmessage = (event) => {
      const message: TChatMessage & { direct_id: number; catch_slug: string } = JSON.parse(event.data);
      if (!message) return;
      removeMessageFromQueue(message.catch_slug);
      queryClient.invalidateQueries({ queryKey: ['directs'] });
      queryClient.invalidateQueries({ queryKey: ['direct-messages'] });
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [campaignId, queryClient, removeMessageFromQueue]);

  const handleGoBack = () => {
    if (currentDirect == null) {
      navigate('/campaigns/direct');
    } else {
      setCurrentDirect(null);
    }
  };

  return (
    <>
      <div className='relative hidden lg:grid  h-full w-full overflow-hidden grid-cols-[max-content,1fr]'>
        <div className='h-full w-full overflow-hidden'>
          <div className='border-b-[1px] border-softgray'>
            <Button onClick={() => navigate('/campaigns/direct')}>
              <ArrowBack /> Назад
            </Button>
          </div>
          <DirectsList />
        </div>
        {currentDirect !== null && (
          <div className='flex flex-col h-full overflow-hidden'>
            <ChatContact />
            <ChatScreen />
            <MessageInput />
          </div>
        )}
      </div>
      <div className='flex flex-col lg:hidden h-full w-full overflow-hidden'>
        <div className='border-b-[1px] border-softgray'>
          <Button onClick={handleGoBack}>
            <ArrowBack /> Назад
          </Button>
        </div>
        {currentDirect === null && <DirectsList />}
        {currentDirect !== null && (
          <div className='flex flex-col h-full overflow-hidden'>
            <ChatContact />
            <ChatScreen />
            <MessageInput />
          </div>
        )}
      </div>
    </>
  );
}

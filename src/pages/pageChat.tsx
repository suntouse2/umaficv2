import DirectsList from '@components/chat/DirectsList';
import titleNotify from '@helpers/titleNotify';
import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

export default function PageChat() {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const params = useParams();
  const directId = Number(params.directId);
  const campaignId = Number(params.campaignId);
  const navigate = useNavigate();

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/directs/messages?campaign_id=${campaignId}&token=${localStorage.getItem('access_token')}`);

    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message: TChatMessage & { direct_id: number; catch_slug: string } = JSON.parse(event.data);
      if (!message) return;
      if (message.is_self == false) {
        titleNotify('Новое сообщение!');
      }
      queryClient.invalidateQueries({ queryKey: ['directs'] });
      queryClient.invalidateQueries({ queryKey: ['direct-messages'] });
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [campaignId, queryClient]);

  const handleGoBack = () => {
    return directId ? navigate(-1) : navigate('/campaigns/direct');
  };

  return (
    <div className='flex flex-col overflow-hidden'>
      <div>
        <Button onClick={handleGoBack}>
          <ArrowBack /> Назад
        </Button>
      </div>
      <div className='hidden lg:grid h-full w-full border-t-[1px] border-softgray overflow-hidden grid-cols-[max-content,1fr]'>
        <DirectsList />
        <Outlet />
      </div>
      <div className='block lg:hidden h-full w-full border-t-[1px] border-softgray overflow-hidden'>
        {!directId && <DirectsList />}
        {directId && <Outlet />}
      </div>
    </div>
  );
}

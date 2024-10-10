import DirectCampaignsList from '@components/campaigns/direct/DirectCampaignsList';
import { Button } from '@mui/material';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

export default function PageDirectCampaign() {
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') navigate('/');
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return (
    <div className='mx-auto w-full h-full overflow-auto p-4'>
      <div className='flex items-center flex-wrap justify-between'>
        <h1 className='text-2xl font-bold'>Поиск клиентов</h1>
        <div className='mt-5 flex gap-4 sm:mt-0'>
          <Button onClick={() => navigate('/')} className='!rounded-full' variant='outlined'>
            Назад
          </Button>
          <Button onClick={() => navigate('/campaigns/direct/create')} color='success' className='!rounded-full' variant='outlined'>
            Создать
          </Button>
        </div>
      </div>
      <DirectCampaignsList />
    </div>
  );
}

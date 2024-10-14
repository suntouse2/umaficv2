import DirectCampaignsList from '@components/campaigns/direct/DirectCampaignsList';
import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PageDirectCampaign() {
  const navigate = useNavigate();

  return (
    <div className='mx-auto w-full h-full overflow-auto p-4'>
      <div className='flex items-center flex-wrap gap-2'>
        <h1 className='text-2xl font-bold'>Поиск клиентов</h1>
      </div>
      <div className='flex justify-between mt-2 gap-4 sm:mt-0'>
        <Button onClick={() => navigate('/')}>
          <ArrowBack /> Назад
        </Button>
        <Button onClick={() => navigate('/campaigns/direct/create')} color='success' className='!rounded-full' variant='outlined'>
          Создать
        </Button>
      </div>
      <DirectCampaignsList />
    </div>
  );
}

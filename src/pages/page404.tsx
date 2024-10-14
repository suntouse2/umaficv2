import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <section className='flex items-center justify-center w-dvw h-dvh'>
      <div>
        <h1 className='text-3xl font-bold'>404. Ошибочка</h1>
        <p>
          Запрошенная страница по пути <b>{location.pathname}</b> не найдена
        </p>
        <p className='text-softgray3'>Это все что знает разработчик:(</p>
        <Button onClick={() => navigate('/')} className='!mt-4 !rounded-full' color='secondary' variant='outlined'>
          На главную
        </Button>
      </div>
      <div className='flex flex-col items-center'>
        <div className='flex gap-4'>
          <div className='w-10 h-4 bg-dark rounded-full'></div>
          <div className='w-10 h-4 bg-dark rounded-full'></div>
        </div>
        <img className='w-40 outline-none border-none rotate-180' src='/img/umafic.jpg' alt='umafic logo' />
      </div>
    </section>
  );
}

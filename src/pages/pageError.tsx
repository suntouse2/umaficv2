import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PageError() {
  const navigate = useNavigate();

  return (
    <section className='flex items-center justify-center flex-col w-dvw h-dvh'>
      <div className='flex gap-4'>
        <div className='w-10 h-4 bg-dark rounded-full'></div>
        <div className='w-10 h-4 bg-dark rounded-full'></div>
      </div>
      <img className='w-40 outline-none border-none rotate-180' src='/img/umafic.jpg' alt='umafic logo' />
      <h1 className='text-3xl font-bold'>Что-то пошло не так</h1>
      <p>Попробуйте обновить страницу или перейти по кнопке ниже</p>
      <Button onClick={() => navigate('/')} className='!mt-4 !rounded-full' color='secondary' variant='contained'>
        На главную
      </Button>
    </section>
  );
}

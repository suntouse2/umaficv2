import { CircularProgress } from '@mui/material';
import { memo } from 'react';

export default memo(function PageGate({ text, loading }: { text: string; loading: boolean }) {
  return (
    <section className='flex items-center justify-center flex-col w-dvw h-dvh'>
      <img src='/img/umafic.svg' className='w-16 mb-6' />
      <h1 className='text-3xl '>{text}</h1>
      {loading && <CircularProgress className='mt-10' color='primary' />}
    </section>
  );
});

import { memo } from 'react';

export default memo(function PageLoading({ text }: { text: string; loading: boolean }) {
  return (
    <section className='flex items-center justify-center flex-col w-dvw h-dvh'>
      <img className='w-40 outline-none border-none' src='/img/umafic.jpg' alt='umafic logo' />
      <h1 className='text-3xl '>{text}</h1>
    </section>
  );
});

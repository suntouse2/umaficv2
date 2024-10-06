import { useAuth } from '@context/AuthContext';
import PageLoading from '@pages/pageLoading';
import { PropsWithChildren, useEffect } from 'react';

export default function AuthWrapper({ children }: PropsWithChildren) {
  const { authState, redirect } = useAuth();

  useEffect(() => {
    if (authState === 'logged-out') redirect();
  }, [authState, redirect]);

  return (
    <>
      {authState == 'error' && <PageLoading loading={false} text='Ошибка сервера, попробуйте еще раз' />}
      {authState == 'pending' && <PageLoading loading text={'Загрузка...'} />}
      {authState == 'logged' && children}
    </>
  );
}

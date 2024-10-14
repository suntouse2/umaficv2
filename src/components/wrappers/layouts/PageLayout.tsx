import AuthWrapper from '@components/wrappers/AuthWrapper';
import MainLayout from '@components/wrappers/layouts/MainLayout';
import { Outlet } from 'react-router-dom';

export default function PageWrapper() {
  return (
    <>
      <AuthWrapper>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </AuthWrapper>
    </>
  );
}

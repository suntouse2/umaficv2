import PaymentWindow from '@components/user/PaymentWindow';
import AuthWrapper from '@components/wrappers/AuthWrapper';
import Container from '@components/wrappers/layouts/Container';
import MainLayout from '@components/wrappers/layouts/MainLayout';

export default function pageBalance() {
  return (
    <section>
      <AuthWrapper>
        <MainLayout>
          <Container>
            <PaymentWindow />
          </Container>
        </MainLayout>
      </AuthWrapper>
    </section>
  );
}

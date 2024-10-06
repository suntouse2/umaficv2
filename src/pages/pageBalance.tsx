import PaymentWindow from '@components/user/PaymentWindow';
import Container from '@components/wrappers/layouts/Container';

export default function pageBalance() {
  return (
    <section>
      <Container>
        <PaymentWindow />
      </Container>
    </section>
  );
}

import { Avatar, Button, Dialog, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import AccountBalanceWalletSharpIcon from '@mui/icons-material/AccountBalanceWalletSharp';
import { useAuth } from '@context/AuthContext';
import formatBalance from '@helpers/formatBalance';
import { lazy, Suspense, useState } from 'react';

type HeaderProps = {
  asideToggleCallback: () => void;
};

const PaymentWindow = lazy(() => import('@components/user/PaymentWindow'));

export default function Header({ asideToggleCallback }: HeaderProps) {
  const { user } = useAuth();
  const [paymentDialogState, setPaymentDialogState] = useState<boolean>(false);

  return (
    <>
      <Dialog open={paymentDialogState} onClose={() => setPaymentDialogState(false)}>
        <Suspense>
          <PaymentWindow />
        </Suspense>
      </Dialog>

      <header className='flex py-2 px-3 items-center justify-between'>
        <IconButton onClick={asideToggleCallback}>
          <Menu />
        </IconButton>
        <article className='flex justify-between gap-2 items-center'>
          <Button onClick={() => setPaymentDialogState(true)} variant='outlined'>
            Пополнить
          </Button>
          <Avatar sx={{ width: 35, height: 35 }} className='!bg-secondary'>
            <AccountBalanceWalletSharpIcon sx={{ width: 20, height: 20 }} />
          </Avatar>
          <span className='font-medium text-lg'>{formatBalance(Number(user?.balance ?? 0))}</span>
        </article>
      </header>
    </>
  );
}

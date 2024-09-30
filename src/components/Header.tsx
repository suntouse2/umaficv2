import { Avatar, Button, Dialog, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import AccountBalanceWalletSharpIcon from '@mui/icons-material/AccountBalanceWalletSharp';
import { useAuth } from '@context/AuthContext';
import formatBalance from '@helpers/formatBalance';
import { useState } from 'react';
import PaymentWindow from '@components/user/PaymentWindow';
type HeaderProps = {
  asideToggleCallback: () => void;
};

export default function Header({ asideToggleCallback }: HeaderProps) {
  const { user } = useAuth();
  const [dialogState, setDialogState] = useState<boolean>(false);
  return (
    <>
      <Dialog open={dialogState} onClose={() => setDialogState(false)}>
        <PaymentWindow />
      </Dialog>
      <header className='flex py-2 px-3 items-center justify-between'>
        <IconButton onClick={asideToggleCallback}>
          <Menu />
        </IconButton>
        <article className='flex justify-between gap-2 items-center'>
          <Button onClick={() => setDialogState(true)} variant='outlined'>
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

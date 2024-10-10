import Book from '@assets/book.svg?react';
import Balance from '@assets/balance.svg?react';
import Support from '@assets/support.svg?react';
import Exit from '@assets/exit.svg?react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { toast } from 'react-toastify';
import { Button, Dialog } from '@mui/material';
import { useState } from 'react';
import { ContentCopy } from '@mui/icons-material';

type AsideProps = {
  asideState: boolean;
  onChange: (state: boolean) => void;
};

export default function Aside({ asideState, onChange }: AsideProps) {
  const { user, logout } = useAuth();
  const [quitDialogState, setQuitDialogState] = useState<boolean>(false);

  const handleIdCopy = async () => {
    if (!user) return;
    await navigator.clipboard.writeText(user.id.toString());
    toast.info('ID Скопирован!');
  };

  const handleClose = () => {
    onChange(false);
  };

  return (
    <>
      <Dialog open={quitDialogState} onClose={() => setQuitDialogState(false)}>
        <div className='p-4'>
          <h2 className='font-bold text-2xl'>Вы действительно хотите выйти?</h2>
          <div className='flex w-full mt-2 gap-2'>
            <Button onClick={() => setQuitDialogState(false)} className='!w-full' variant='outlined' color='secondary'>
              Остаться
            </Button>
            <Button onClick={logout} className='!w-full' variant='outlined' color='error'>
              Выйти
            </Button>
          </div>
        </div>
      </Dialog>
      <div className={`${asideState ? 'block' : 'hidden'} w-full fixed h-full  bg-backdrop overflow-hidden  transition-[max-width] duration-300 z-1 md:w-max md:relative z-20`} onClick={handleClose}>
        <aside className={` bg-white border-r-[1px] h-dvh border-border overflow-auto w-48`} onClick={(e) => e.stopPropagation()}>
          <nav>
            <button className='w-full min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray' onClick={handleIdCopy} type='button'>
              <img className='w-5' src='/img/umafic.jpg' alt='umafic logo' />
              <p className='flex gap-2 items-center'>
                <span>#{user?.id}</span>
                <ContentCopy className='!text-[15px]' />
              </p>
            </button>
            <hr className='h-[1px] border-none bg-border' />
            <NavLink to='/' className={({ isActive }) => `${isActive ? '[&>svg>path]:fill-secondaryHigh' : ''} min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray  `}>
              <Book />
              <span className='block'>Главная</span>
            </NavLink>
            <hr className='h-[1px] border-none bg-border' />
            <NavLink to='/balance' className={({ isActive }) => `${isActive ? '[&>svg>g>path]:fill-secondaryHigh' : ''} min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray  `}>
              <Balance />
              <span className='block'>Баланс</span>
            </NavLink>

            {/* <hr className='h-[1px] border-none bg-border' />
          <NavLink to='/alert' className={({ isActive }) => `${isActive ? '[&>svg>path]:fill-secondaryHigh' : ''} min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray  `}>
            <Alert />
            <span className='group-hover:block'>Оповещения</span>
          </NavLink> */}
            <hr className='h-[1px] border-none bg-border' />
            <a className='min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray' href='https://t.me/Umafic_support' target='_blank'>
              <Support />
              <span className='block'>Поддержка</span>
            </a>
            <hr className='h-[1px] border-none bg-border' />
            <button onClick={() => setQuitDialogState(true)} className='w-full min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray' type='button'>
              <Exit />
              <span className='block'>Выйти</span>
            </button>
            <hr className='h-[1px] border-none bg-border' />
            <a href='/documents/Публичная_оферта.docx' className='min-h-12 border-none outline-none no-underline flex px-4 py-2 gap-4 items-center  whitespace-nowrap text-xs hover:bg-softgray'>
              <span className='block'>Публичная оферта</span>
            </a>
            <a href='/documents/Пользовательское_соглашение.docx' download className='min-h-12 border-none outline-none no-underline text-xs flex px-4 py-2 gap-4 hover:bg-softgray'>
              <span className='block'>
                Пользовательское <br />
                соглашение
              </span>
            </a>
          </nav>
        </aside>
      </div>
    </>
  );
}

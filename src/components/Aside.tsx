import Book from '@assets/book.svg?react';
import Balance from '@assets/balance.svg?react';
import Support from '@assets/support.svg?react';
import Exit from '@assets/exit.svg?react';
import { useAuth } from '@context/AuthContext';
import { toast } from 'react-toastify';
import { ContentCopy } from '@mui/icons-material';
import NavItem from '@components/NavItem';
import { supportLink } from '@static/links';

type AsideProps = {
  asideState: boolean;
  onChange: (state: boolean) => void;
};

export default function Aside({ asideState, onChange }: AsideProps) {
  const { user, exit } = useAuth();

  const handleIdCopy = async () => {
    if (!user) return;
    await navigator.clipboard.writeText(user.id.toString());
    toast.info('ID Скопирован!');
  };

  const handleClose = () => {
    onChange(false);
  };

  const handleExit = () => {
    if (confirm('Вы точно хотите выйти?')) exit();
  };

  return (
    <>
      <div className={`${asideState ? 'block' : 'hidden'} w-full fixed h-full bg-backdrop overflow-hidden   md:relative z-20`} onClick={handleClose}>
        <aside className={` bg-white border-r-[1px] h-dvh border-border overflow-auto w-48`} onClick={(e) => e.stopPropagation()}>
          <nav>
            <button className='w-full min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray' onClick={handleIdCopy} type='button'>
              <img src='/img/umafic.svg' className='w-4' />
              <p className='flex gap-2 items-center'>
                <span>#{user?.id}</span>
                <ContentCopy className='!text-[15px]' />
              </p>
            </button>
            <hr className='h-[1px] border-none bg-border' />
            <NavItem type='link' to='/' Icon={Book} title='Главная' />
            <hr className='h-[1px] border-none bg-border' />
            <NavItem type='link' to='/balance' Icon={Balance} title='Баланс' />
            <hr className='h-[1px] border-none bg-border' />
            <NavItem type='a' Icon={Support} title='Поддержка' href={supportLink} />
            <hr className='h-[1px] border-none bg-border' />
            <NavItem type='button' Icon={Exit} title='Выйти' onClick={handleExit} />
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

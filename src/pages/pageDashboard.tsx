import Bubble from '@components/common/Bubble';
import AuthWrapper from '@components/wrappers/AuthWrapper';
import Container from '@components/wrappers/layouts/Container';
import MainLayout from '@components/wrappers/layouts/MainLayout';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PageDashboard() {
  const navigate = useNavigate();

  return (
    <AuthWrapper>
      <section>
        <MainLayout>
          <Container>
            <h1 className='text-3xl my-2 font-bold text-softgray4'>Umafic ADS</h1>
            <div className='flex gap-3 mt-5'>
              <Button href='https://t.me/Umafic_support' target='_blank' className='!rounded-full' variant='contained'>
                Тех.поддержка
              </Button>
              {/* <Button className='!rounded-full' variant='outlined'>
                Для партнеров
              </Button> */}
            </div>
            <article className='grid grid-cols-auto-fill-100 gap-5 mt-10'>
              <Bubble onClick={() => navigate('/campaigns/direct')}>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Поиск клиентов</h1>
                  {/* <Badge badgeContent='5' color='primary'>
                    <Chat className='!fill-softgray3' />
                  </Badge> */}
                </div>
                {/* <p className='text-positive text-xs'>9 активных</p> */}
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Таргет рассылка</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Пиар в чатах</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>GEO Таргет</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Услуги маркетолога</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Таргет Инвайт</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Посты в чатах</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Директ</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Антиспам бот</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Автовебинары</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
              <Bubble>
                <div className='flex items-center justify-between mb-5'>
                  <h1 className='text-2xl'>Объявления</h1>
                </div>
                <p className='text-softgray3 text-xs'>В разработке...</p>
              </Bubble>
            </article>
          </Container>
        </MainLayout>
      </section>
    </AuthWrapper>
  );
}

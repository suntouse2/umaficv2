import { Controller, useForm } from 'react-hook-form';
import Bubble from '@components/common/Bubble';
import { Input } from '@components/common/Input';
import TipBox from '@components/common/TipBox';
import CampaignLocationManager from '@components/campaigns/CampaignLocationManager';
import { useFetchLanguages, useFetchCountries, useFetchRegions, useFetchCities, useFetchSettingsCheckStats, useCreateDirectCampaign, useEditDirectCampaign } from '@api/queries';
import CampaignKeywordManager from '@components/campaigns/CampaignKeywordManager';
import CampaignCheckSettings from '@components/campaigns/CampaignCheckSettings';
import { FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import CampaignMessageManager from '@components/campaigns/CampaignMessageManager';
import CampaignAvatar from '@components/campaigns/CampaignAvatar';
import { ToggleButtonGroup, ToggleButton, Tabs, Tab, Button, Dialog } from '@mui/material';
import { useBlocker, useNavigate } from 'react-router-dom';
import { anyMessageTip, firstMessageTip, keywordMessageTip, keywordTip, locationTip, minusWordsTip, orderMessageTip, profileTip } from '@components/helpers/tips';
import formatBalance from '@helpers/formatBalance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import parseBudget from '@helpers/parseBudget';

type UpsertFormType = TDirectCampaignSettings & {
  temporary: {
    first_message: { messages: TFunnelMessage[] }[];
    any_message: { messages: TFunnelMessage[] }[];
  };
};

export default function CampaignUpsertForm({ data, id }: { data?: UpsertFormType; id?: number }) {
  const { control, watch, setValue, getValues, formState } = useForm<UpsertFormType>({
    defaultValues: data,
  });

  const navigate = useNavigate();
  const { data: languagesData } = useFetchLanguages();
  const { data: countriesData } = useFetchCountries(watch('settings.target.geo.language') ?? []);
  const { data: regionsData } = useFetchRegions(watch('settings.target.geo.country') ?? []);
  const { data: citiesData } = useFetchCities(watch('settings.target.geo.region') ?? []);
  const { mutateAsync: createCampaign } = useCreateDirectCampaign();
  const { mutateAsync: editCampaign } = useEditDirectCampaign();
  const { data: statsData } = useFetchSettingsCheckStats(watch('settings.target'));
  const profileTipMemo = useMemo(() => profileTip, []);
  const locationTipMemo = useMemo(() => locationTip, []);
  const keywordTipMemo = useMemo(() => keywordTip, []);
  const minusWordsTipMemo = useMemo(() => minusWordsTip, []);
  const firstMessageTipMemo = useMemo(() => firstMessageTip, []);
  const keywordMessageTipMemo = useMemo(() => keywordMessageTip, []);
  const orderMessageTipMemo = useMemo(() => orderMessageTip, []);
  const anyMessageTipMemo = useMemo(() => anyMessageTip, []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tabs, setTabs] = useState<{ name: string; disabled: boolean }[]>([
    {
      name: 'Профиль',
      disabled: false,
    },
    {
      name: 'Аудитория',
      disabled: true,
    },
    {
      name: 'Таргет',
      disabled: true,
    },
    {
      name: 'Сообщения',
      disabled: true,
    },
    {
      name: 'Запуск',
      disabled: true,
    },
  ]);
  const first_name = !watch('settings.profile.first_name') || watch('settings.profile.first_name').length === 0;
  const keyword = !watch('settings.target.search.include') || watch('settings.target.search.include').length === 0;
  const order = !watch('settings.auto_reply.funnel.order') || watch('settings.auto_reply.funnel.order').length === 0;
  const first = !watch('temporary.first_message') || watch('temporary.first_message').length === 0;

  const byType = !watch('settings.auto_reply.funnel.funnel_type') || watch('settings.auto_reply.funnel.funnel_type') == 'keyword' ? first : order;

  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    setDirty(formState.isDirty);
  }, [formState.isDirty, setDirty]);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (isSubmitting) {
      return false;
    }
    return data !== undefined && dirty && currentLocation.pathname !== nextLocation.pathname;
  });

  useEffect(() => {
    setTabs((prevTabs) => {
      const cTabs = [...prevTabs];
      cTabs[1].disabled = first_name;
      cTabs[2].disabled = first_name;
      cTabs[3].disabled = keyword || first_name;
      cTabs[4].disabled = byType || keyword || first_name;

      return cTabs;
    });
  }, [byType, first, first_name, keyword, order]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    try {
      setIsSubmitting(true);
      if (blocker.state === 'blocked') {
        blocker.reset();
      }
      e.preventDefault();
      if (tabs.some((e) => e.disabled)) return;
      if (getValues('name').length == 0) return toast.error('Имя кампании пустое');
      if (Number(getValues('budget_limit')) < 10) return toast.error('Бюджет кампании должен быть больше 10 рублей');

      const requestData = getValues();
      const transposedData = { ...requestData };
      if (transposedData.settings.auto_reply.funnel.funnel_type == 'keyword') {
        const firstMessages = transposedData?.temporary?.first_message[0]?.messages;
        const anyMessages = transposedData?.temporary?.any_message[0]?.messages;
        if (!firstMessages || firstMessages.length == 0) return;
        transposedData.settings.auto_reply.funnel.order = [];
        transposedData.settings.auto_reply.funnel.order.push({ order: 1, messages: [...firstMessages] });
        if (anyMessages && anyMessages.length > 0) transposedData.settings.auto_reply.funnel.order.push({ order: 2, messages: [...anyMessages] });
      }

      delete (transposedData as { [key: string]: unknown })['temporary'];
      if (data == undefined) {
        await createCampaign({ data: transposedData });

        navigate('/campaigns/direct');
        return toast.success('Кампания создана');
      }
      if (data && id) {
        await editCampaign({ id: id, data: transposedData });
        navigate('/campaigns/direct');
        return toast.success('Кампания изменена');
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error instanceof AxiosError) {
        return toast.error(`${error.status}: Ошибка при создании кампании`);
      }
    }
  };

  return (
    <>
      {blocker.state === 'blocked' ? (
        <Dialog open={true} onClose={() => blocker.reset()}>
          <div className='p-4'>
            <h2 className='font-bold text-xl'>Ваши изменения не сохранены</h2>
            <p className=''>
              Ваши изменения не сохранены. Вы точно хотите выйти <b>не сохранив</b> изменения?
            </p>
            <div className='flex gap-2 mt-5'>
              <Button
                className='w-full'
                variant='outlined'
                onClick={() => {
                  if (blocker.state === 'blocked') {
                    blocker.proceed();
                    blocker.reset();
                  }
                }}>
                Выйти
              </Button>
              <Button className='w-full' color='secondary' variant='outlined' onClick={handleSubmit}>
                Сохранить
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}
      <form onSubmit={handleSubmit} className='mx-auto w-full h-full max-w-[600px] '>
        <h1 className='text-2xl font-bold'>Поиск клиентов</h1>

        <div>
          <Tabs textColor='secondary' indicatorColor='secondary' value={currentStep} onChange={(_e, v) => setCurrentStep(v)} variant='scrollable' scrollButtons='auto' allowScrollButtonsMobile>
            {tabs.map((tab, i) => (
              <Tab label={tab.name} disabled={tab.disabled} key={i} />
            ))}
          </Tabs>
          {currentStep == 0 && (
            <Bubble className='mt-4 relative'>
              <div className='grid grid-cols-1 sm:grid-cols-2 p-4 gap-5'>
                <div className='flex flex-col items-center  gap-5'>
                  <Controller defaultValue={null} control={control} name='settings.profile.photo' render={({ field: { onChange, value } }) => <CampaignAvatar onChange={onChange} value={value} />} />
                  <Controller defaultValue={''} control={control} name='settings.profile.first_name' render={({ field: { onChange, value } }) => <Input className='w-full' value={value} onChange={onChange} placeholder='Имя' />} />
                  <Controller defaultValue={''} control={control} name='settings.profile.last_name' render={({ field: { onChange, value } }) => <Input className='w-full' value={value} onChange={onChange} placeholder='Фамилия' />} />
                  <Controller defaultValue={''} control={control} name='settings.profile.about' render={({ field: { onChange, value } }) => <Input resize className='w-full min-h-32' value={value} onChange={onChange} placeholder='Обо мне' />} />
                </div>
                <div className='block sm:hidden'>
                  <TipBox content={profileTipMemo} />
                </div>

                <div className='hidden sm:block'>
                  <p className='text-sm'>
                    1. Нажмите на кнопку "Загрузить фото" и выберите изображение, которое вы хотели бы использовать для профиля бота. <br />
                    <br /> 2. Введите имя и фамилию, которые будут отображаться на странице бота.
                    <br />
                    <br /> 3. Напишите краткую информацию в графу "О себе". Это поможет создать впечатление, что страница принадлежит реальному человеку.
                    <br />
                    <br /> 4. Обратите внимание, что указание сферы интересов не обязательно, но если вы хотите, чтобы ваш бот выглядел максимально натурально, можете добавить информацию о его увлечениях или интересах.
                  </p>
                </div>
              </div>
            </Bubble>
          )}
          {currentStep == 1 && (
            <Bubble className='relative mt-4'>
              <TipBox content={locationTipMemo} />
              <h2 className='text-lg font-bold'>География</h2>
              <p className='text-sm mt-2 mb-2'>Выберите нужные регионы и увеличьте эффективность вашей рекламы! Настройте точечную рекламу и достигните своей целевой аудитории прямо сейчас.</p>
              <Controller defaultValue={[]} control={control} name='settings.target.geo.language' render={({ field: { value, onChange } }) => <CampaignLocationManager value={new Set(value)} onChange={(v) => onChange(Array.from(v))} placeholder='введите язык' label='Добавить язык' options={new Map(Object.entries(languagesData ?? []))} />} />
              <Controller defaultValue={[]} control={control} name='settings.target.geo.country' render={({ field: { value, onChange } }) => <CampaignLocationManager value={new Set(value)} onChange={(v) => onChange(Array.from(v))} placeholder='введите страну' label='Добавить страну' options={new Map(Object.entries(countriesData ?? []))} />} />
              <Controller defaultValue={[]} control={control} name='settings.target.geo.region' render={({ field: { value, onChange } }) => <CampaignLocationManager value={new Set(value)} onChange={(v) => onChange(Array.from(v))} placeholder='введите регион' label='Добавить регион' options={new Map(Object.entries(regionsData ?? []))} />} />
              <Controller defaultValue={[]} control={control} name='settings.target.geo.city' render={({ field: { value, onChange } }) => <CampaignLocationManager value={new Set(value)} onChange={(v) => onChange(Array.from(v))} placeholder='введите город' label='Добавить город' options={new Map(Object.entries(citiesData ?? []))} />} />
            </Bubble>
          )}
          {currentStep == 2 && (
            <>
              <Bubble className='relative mt-4'>
                <TipBox content={keywordTipMemo} />
                <Controller defaultValue={[]} control={control} name='settings.target.search.include' render={({ field: { value, onChange } }) => <CampaignKeywordManager title='Ключевые фразы' description='Фразы, которые система будет искать в чатах Telegram.' value={new Set(value)} onChange={(v) => onChange(Array.from(v))} />} />
              </Bubble>
              <Bubble className='mt-4 relative'>
                <TipBox content={minusWordsTipMemo} />
                <Controller defaultValue={[]} control={control} name='settings.target.search.exclude' render={({ field: { value, onChange } }) => <CampaignKeywordManager title='Минус-слова' description='Фразы, которые система будет исключать из поиска в чатах Telegram.' value={new Set(value)} onChange={(v) => onChange(Array.from(v))} />} />
              </Bubble>
              <Bubble className='mt-4'>
                <p className='text-sm'>
                  Перед запуском Umafic Таргет рекомендуем проверить настройки поисковых фраз. <br />
                  <br /> Для этого используем кнопку "Проверить Настройки".
                  <br />
                  <br /> При этом система в режиме реального времени покажет, на какие сообщения будет реагировать. Благодаря этому инструменту вы сможете решить, какие фразы нужно добавить или исключить из "Поисковых фраз", а также "Минус-фраз". <br />
                  <br /> Для добавления, нажмите на слово в найденном сообщении, при необходимости измените его и добавьте в "Поисковые фразы" или "Минус-фразы"{' '}
                </p>
                {watch('settings.target.search.include')?.length > 0 ? (
                  <CampaignCheckSettings
                    onChange={(t) => {
                      setValue('settings.target.search.include', t.search.include);
                      setValue('settings.target.search.exclude', t.search.exclude);
                    }}
                    value={watch('settings.target')}
                  />
                ) : (
                  <p className='text-base mt-4 text-negative'>Чтобы проверить настройки, добавьте минимум одно ключевое слово.</p>
                )}
              </Bubble>
            </>
          )}
          {currentStep == 3 && (
            <>
              <Controller
                control={control}
                defaultValue='keyword'
                name='settings.auto_reply.funnel.funnel_type'
                render={({ field: { value, onChange } }) => (
                  <ToggleButtonGroup color='secondary' className='mt-2' value={value} exclusive onChange={(v) => onChange(v)} aria-label='Platform'>
                    <ToggleButton value='order'>По порядку</ToggleButton>
                    <ToggleButton value='keyword'>По ключевым словам</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              {/* <div className='flex  items-center'>
              <Switch color='secondary' />
              <p>Включить режим общения с искусственным интелектом</p>
            </div> */}
              <p className='mt-2 mb-2 text-sm'>
                Вы можете выбрать только один из двух режимов. По порядку или по ключевым словам. На данный момент выбрано: <span className='text-secondary'>{watch('settings.auto_reply.funnel.funnel_type') == 'order' ? 'По порядку' : 'По ключевым словам'}</span>
              </p>
              {watch('settings.auto_reply.funnel.funnel_type') == 'order' ? (
                <Bubble className='mt-2 relative'>
                  <TipBox content={orderMessageTipMemo} />
                  <h2 className='text-lg font-bold'>Настройка диалога по порядку</h2>
                  <p className='text-sm mb-4'>Сообщения, которые будут отправляться, если не выбраны ключевые слова.</p>
                  <Controller defaultValue={[]} control={control} name='settings.auto_reply.funnel.order' render={({ field: { value, onChange } }) => <CampaignMessageManager filter_type='order' value={value} onChange={onChange} />} />
                </Bubble>
              ) : (
                <>
                  <Bubble className='mt-2 relative'>
                    <TipBox content={firstMessageTipMemo} />
                    <h2 className='text-lg font-bold'>Первое сообщение</h2>
                    <p className='text-sm mb-4'>Сообщение, которое будет отправлено в чат или в личные сообщения первым.</p>
                    <Controller defaultValue={[]} control={control} name='temporary.first_message' render={({ field: { value, onChange } }) => <CampaignMessageManager filter_type='none' value={value} onChange={onChange} />} />
                  </Bubble>
                  <Bubble className='mt-2 relative'>
                    <TipBox content={keywordMessageTipMemo} />
                    <h2 className='text-lg font-bold'>Настройка диалога по ключевым словам</h2>
                    <p className='text-sm mb-4'>Сообщения, которые будут отправляться, если пользователь продолжил общение.</p>
                    <Controller defaultValue={[]} control={control} name='settings.auto_reply.funnel.keyword' render={({ field: { value, onChange } }) => <CampaignMessageManager filter_type='keyword' value={value} onChange={onChange} />} />
                  </Bubble>
                  <Bubble className='mt-2 relative'>
                    <TipBox content={anyMessageTipMemo} />
                    <h2 className='text-lg font-bold'>Настройка диалога на любые фразы</h2>
                    <p className='text-sm mb-4'>Сообщения, которые будут отправляться, если не выбраны другие настройки.</p>
                    <Controller defaultValue={[]} control={control} name='temporary.any_message' render={({ field: { value, onChange } }) => <CampaignMessageManager filter_type='none' value={value} onChange={onChange} />} />
                  </Bubble>
                </>
              )}
            </>
          )}
          {currentStep == 4 && (
            <>
              <Bubble>
                <h2 className='text-lg font-bold'>Запуск</h2>
                <p className='text-sm mb-4'>Придумайте название кампании и укажите бюджет для нее.</p>
                <Controller defaultValue={''} control={control} name='name' render={({ field: { onChange, value } }) => <Input className='w-full mt-2' value={value} onChange={onChange} placeholder='Название кампании' />} />
                <Controller defaultValue={''} control={control} name='budget_limit' render={({ field: { onChange, value } }) => <Input className='w-full mt-4' onBlur={(e) => onChange(parseBudget(e.target.value))} value={value} onChange={onChange} placeholder='Бюджет кампании' />} />
                <b className='mt-2 text-sm'>
                  Рекомендуемый суточный бюджет по статистике: <span className='text-secondary'>{formatBalance(statsData?.data.recommended_daily_budget_limit)}</span>
                </b>
              </Bubble>
              <Button type='submit' color='secondary' variant='outlined' className='!rounded-full w-full !mt-5'>
                {data ? 'Сохранить' : 'Создать'}
              </Button>
            </>
          )}
          <div className='flex justify-between gap-4 mt-2'>
            <Button
              onClick={() => {
                if (currentStep == 0) return navigate('/campaigns/direct');
                setCurrentStep((prev) => prev - 1);
              }}
              variant='outlined'
              className='!rounded-full w-full'>
              Назад
            </Button>
            {currentStep < 4 && (
              <Button
                onClick={() => {
                  if (currentStep == tabs.length - 1) return;
                  setCurrentStep((prev) => prev + 1);
                }}
                disabled={tabs[currentStep + 1]?.disabled}
                variant='outlined'
                className='!rounded-full w-full'>
                {currentStep == tabs.length - 1 ? 'Сохранить' : 'Далее'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

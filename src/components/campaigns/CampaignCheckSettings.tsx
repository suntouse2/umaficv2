import { useFetchSettingsCheckMsg } from '@api/queries';
import dateToString from '@helpers/dateToString';
import { Button, ButtonGroup, Dialog, LinearProgress, Popover, Tab, Tabs, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';

type CampaignCheckSettingsProps = {
  value: TCampaignSettingsTarget;
  onChange: (value: TCampaignSettingsTarget) => void;
};

export default function CampaignCheckSettings({ value, onChange }: CampaignCheckSettingsProps) {
  const [dialogState, setDialogState] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const { ref, inView } = useInView();

  const keyword = value.search.include[selectedTab];

  const { data, isFetching, fetchNextPage, refetch } = useFetchSettingsCheckMsg({
    ...value,
    search: {
      ...value.search,
      include: keyword ? [keyword] : [],
    },
  });

  const handleWordClick = (event: React.MouseEvent<HTMLElement>, word: string) => {
    setAnchorEl(event.currentTarget);
    setEditingKeyword(word);
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleIncludeKeyword = () => {
    if (!editingKeyword) return;
    onChange({
      ...value,
      search: {
        ...value.search,
        include: Array.from(new Set([...value.search.include, editingKeyword])),
      },
    });
    setAnchorEl(null);
  };
  const handleExcludeKeyword = () => {
    if (!editingKeyword) return;
    onChange({
      ...value,
      search: {
        ...value.search,
        exclude: Array.from(new Set(value.search.exclude ? [...value.search.exclude, editingKeyword] : [editingKeyword])),
      },
    });
    setAnchorEl(null);
    toast.info('Чтобы увидеть изменения, откройте проверку заново.');
  };

  useEffect(() => {
    if (!dialogState) refetch();
  }, [dialogState, value.search.include, value.search.exclude, refetch]);

  return (
    <div className='mt-4'>
      <div>
        <Button onClick={() => setDialogState(true)} variant='outlined' color='secondary' className='!rounded-full'>
          Проверить настройки
        </Button>
        <Dialog
          PaperProps={{
            style: { height: '100%', width: '100%' },
          }}
          open={dialogState}
          onClose={() => setDialogState(false)}>
          <div className='p-3'>
            <Tabs indicatorColor='secondary' textColor='secondary' value={selectedTab} onChange={handleTabChange} aria-label='tabs for settings'>
              {value.search.include.map((item, index) => (
                <Tab key={index} label={item} />
              ))}
            </Tabs>
            <ul className='w-full flex flex-col gap-5 py-2'>
              {isFetching && <LinearProgress color='secondary' />}
              {data?.pages.map((messages) =>
                messages.data.map((msg) => (
                  <li className='w-full  text-sm bg-softgray rounded-md p-2' key={msg.id}>
                    {msg.content.message.split(' ').map((word, index) => (
                      <span key={index} onClick={(e) => handleWordClick(e, word)} className='cursor-pointer'>
                        {word}{' '}
                      </span>
                    ))}
                    <div className='w-full flex justify-end'>
                      <span className='text-xs mt-2 text-softgray4'>{dateToString(new Date(msg.date))}</span>
                    </div>
                  </li>
                ))
              )}
              {data?.pages[0].data.length == 0 && <p>Сообщений не найдено</p>}
            </ul>
            <div ref={ref}></div>
          </div>
          {anchorEl && (
            <Popover onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)} anchorEl={anchorEl}>
              <div className='bg-white p-5 flex flex-col gap-2'>
                <TextField variant='standard' value={editingKeyword} onChange={(e) => setEditingKeyword(e.target.value)} />
                <ButtonGroup>
                  <Button onClick={handleIncludeKeyword} color='success'>
                    Добавить
                  </Button>
                  <Button onClick={handleExcludeKeyword} color='error'>
                    Исключить
                  </Button>
                </ButtonGroup>
              </div>
            </Popover>
          )}
        </Dialog>
      </div>
    </div>
  );
}

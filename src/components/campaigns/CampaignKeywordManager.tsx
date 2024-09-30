import TagInput from '@components/common/TagInput';
import TagList from '@components/common/TagList';
import { Button, ClickAwayListener, Dialog, DialogTitle } from '@mui/material';
import getBreakpoints from '@static/mediaBreakpoints';
import { useCallback, useState } from 'react';
import { addTag, addTagList, removeAllTags } from '@helpers/tagHelper';
type CampaignKeywordManagerProps = {
  title?: string;
  description?: string;
  value: Set<string>;
  onChange: (value: Set<string>) => void;
};

export default function CampaignKeywordManager({ title, description, value, onChange }: CampaignKeywordManagerProps) {
  const [popupState, setPopupState] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<boolean>(false);
  const [deleteAllDialogState, setDeleteAllDialogState] = useState<boolean>(false);

  const closePopupAndDialog = useCallback(() => {
    setPopupState(false);
    setDialogState(false);
  }, []);

  const openPopupOrDialog = useCallback(() => {
    return window.innerWidth <= getBreakpoints(false).md ? setDialogState(true) : setPopupState(true);
  }, []);

  const handleAddTag = useCallback(
    (newTag: string, type: 'list' | 'single') => {
      const updatedTags = type == 'list' ? addTagList(value, newTag) : addTag(value, newTag);
      onChange(updatedTags);
    },
    [value, onChange]
  );

  const handleDeleteAllTags = useCallback(() => {
    onChange(removeAllTags());
  }, [onChange]);

  return (
    <div>
      <div>
        <h2 className='text-lg font-bold'>{title}</h2>
        <p className='text-sm mt-2'>{description}</p>
        <div className='mt-3 flex gap-2'>
          <div className='relative '>
            <Button onClick={openPopupOrDialog} color='secondary' variant='outlined' className='!rounded-full '>
              Создать
            </Button>
            {popupState && (
              <ClickAwayListener mouseEvent='onMouseDown' touchEvent='onTouchStart' onClickAway={() => setPopupState(false)}>
                <div className='absolute z-10 left-full ml-2 top-0'>
                  <TagInput onClose={closePopupAndDialog} onAdd={handleAddTag} />
                </div>
              </ClickAwayListener>
            )}
          </div>
          <Button onClick={() => setDeleteAllDialogState(true)} variant='outlined' color='error' className='!rounded-full'>
            Удалить все
          </Button>
        </div>
        <Dialog open={dialogState} onClose={() => setDialogState(false)}>
          <TagInput onClose={closePopupAndDialog} onAdd={handleAddTag} />
        </Dialog>
        <Dialog open={deleteAllDialogState} onClose={() => setDeleteAllDialogState(false)}>
          <div className='p-2'>
            <DialogTitle>
              Вы уверены что хотите <br />
              удалить все {title?.toLowerCase()}?
            </DialogTitle>
            <div className='flex gap-1'>
              <Button onClick={() => setDeleteAllDialogState(false)} className='!w-full' variant='contained'>
                Отменить
              </Button>
              <Button
                onClick={() => {
                  setDeleteAllDialogState(false);
                  handleDeleteAllTags();
                }}
                className='!w-full'
                variant='contained'
                color='error'>
                Удалить
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
      <TagList editable={true} value={value} onChange={onChange} />
    </div>
  );
}

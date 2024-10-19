import TagInput from '@components/common/TagInput';
import TagList from '@components/common/TagList';
import { Button, Dialog, DialogTitle, Popover } from '@mui/material';
import getBreakpoints from '@static/mediaBreakpoints';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { addTag, addTagList, removeAllTags } from '@helpers/tagHelper';
type KeywordManagerProps = {
  value: Set<string>;
  onChange: (value: Set<string>) => void;
};

export default function KeywordManager({ value, onChange }: KeywordManagerProps) {
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  const [dialogState, setDialogState] = useState<boolean>(false);
  const [deleteAllDialogState, setDeleteAllDialogState] = useState<boolean>(false);

  const closePopupAndDialog = useCallback(() => {
    setPopoverAnchor(null);
    setDialogState(false);
  }, []);

  const openPopupOrDialog = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    return window.innerWidth <= getBreakpoints(false).md ? setDialogState(true) : setPopoverAnchor(e.currentTarget);
  }, []);

  const handleAddTag = useCallback(
    (newTag: string, type: 'list' | 'single') => {
      const updatedTags = type == 'list' ? addTagList(value, newTag) : addTag(value, newTag);
      onChange(updatedTags);
    },
    [value, onChange]
  );

  const popoverPosition = useMemo(
    () => ({
      anchorOrigin: { vertical: 'center' as const, horizontal: 'right' as const },
      transformOrigin: { vertical: 'center' as const, horizontal: 'left' as const },
    }),
    []
  );

  const handleDeleteAllTags = useCallback(() => {
    onChange(removeAllTags());
  }, [onChange]);

  return (
    <div>
      <div>
        <div className='mt-3 flex gap-2'>
          <Button onClick={openPopupOrDialog} color='secondary' variant='outlined' className='!rounded-full '>
            Создать
          </Button>
          <Popover {...popoverPosition} onClose={() => setPopoverAnchor(null)} open={Boolean(popoverAnchor)} anchorEl={popoverAnchor}>
            <TagInput onClose={closePopupAndDialog} onAdd={handleAddTag} />
          </Popover>
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
              удалить все теги?
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

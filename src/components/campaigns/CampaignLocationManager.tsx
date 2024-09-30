import SelectInput from '@components/common/SelectInput';
import { Delete } from '@mui/icons-material';
import { List, ListItem, IconButton, ListItemText, Button, ClickAwayListener, Dialog } from '@mui/material';
import getBreakpoints from '@static/mediaBreakpoints';
import { useState } from 'react';

type CampaignLocationManagerProps = {
  placeholder: string;
  label: string;
  value: Set<string>;
  onChange: (value: Set<string>) => void;
  options: Map<string, string>;
};

export default function CampaignLocationManager({ label, onChange, placeholder, options, value }: CampaignLocationManagerProps) {
  const [popupState, setPopupState] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<boolean>(false);

  const closePopupAndDialog = () => {
    setPopupState(false);
    setDialogState(false);
  };
  const openPopupOrDialog = () => {
    return window.innerWidth <= getBreakpoints(false).md ? setDialogState(true) : setPopupState(true);
  };

  const handleAddOption = (key: string) => {
    const newSet = new Set(value);
    newSet.add(key);
    onChange(newSet);
  };

  const handleDeleteOption = (key: string) => {
    const newSet = new Set(value);
    newSet.delete(key);
    onChange(newSet);
  };

  return (
    <div>
      <div className='relative w-max'>
        <Button onClick={openPopupOrDialog} variant='outlined' color='secondary' className='!rounded-full'>
          {label}
        </Button>
        {popupState && (
          <ClickAwayListener mouseEvent='onMouseDown' touchEvent='onTouchStart' onClickAway={() => setPopupState(false)}>
            <div className='z-10 bg-white p-2 left-full ml-2 rounded-md shadow-[0_1px_5px_#0003,0_2px_2px_#00000024,0_3px_1px_-2px_#0000001f] top-[-5px] absolute min-w-60'>
              <SelectInput onClose={closePopupAndDialog} onAdd={handleAddOption} placeholder={placeholder} options={options} />
            </div>
          </ClickAwayListener>
        )}
      </div>
      <List>
        {Array.from(value).map((v) => (
          <ListItem
            key={v}
            className='bg-inputbg rounded-xl px-2'
            secondaryAction={
              <IconButton edge='end' aria-label='delete' onClick={() => handleDeleteOption(v)}>
                <Delete color='error' />
              </IconButton>
            }>
            <ListItemText primary={options.get(v)} />
          </ListItem>
        ))}
      </List>
      <Dialog open={dialogState} onClose={() => setDialogState(false)}>
        <div className='p-2'>
          <SelectInput onAdd={handleAddOption} placeholder={placeholder} options={options} />
        </div>
      </Dialog>
    </div>
  );
}

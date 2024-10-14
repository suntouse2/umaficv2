import SelectInput from '@components/common/SelectInput';
import { Delete } from '@mui/icons-material';
import { List, ListItem, IconButton, ListItemText, Button, Dialog, Popover } from '@mui/material';
import getBreakpoints from '@static/mediaBreakpoints';
import { MouseEvent, useMemo, useState } from 'react';

type CampaignLocationManagerProps = {
  placeholder: string;
  label: string;
  value: Set<string>;
  onChange: (value: Set<string>) => void;
  options: Map<string, string>;
};

export default function CampaignLocationManager({ label, onChange, placeholder, options, value }: CampaignLocationManagerProps) {
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  const [dialogState, setDialogState] = useState<boolean>(false);

  const closePopupAndDialog = () => {
    setPopoverAnchor(null);
    setDialogState(false);
  };
  const openPopupOrDialog = (e: MouseEvent<HTMLButtonElement>) => {
    return window.innerWidth <= getBreakpoints(false).md ? setDialogState(true) : setPopoverAnchor(e.currentTarget);
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

  const popoverPosition = useMemo(
    () => ({
      anchorOrigin: { vertical: 'center' as const, horizontal: 'right' as const },
      transformOrigin: { vertical: 'center' as const, horizontal: 'left' as const },
    }),
    []
  );

  return (
    <div>
      <div className='relative w-max'>
        <Button onClick={openPopupOrDialog} variant='outlined' color='secondary' className='!rounded-full'>
          {label}
        </Button>
        <Popover sx={{ marginLeft: '5px' }} onClose={() => setPopoverAnchor(null)} open={Boolean(popoverAnchor)} anchorEl={popoverAnchor} {...popoverPosition}>
          <div className='p-2'>
            <SelectInput onClose={closePopupAndDialog} onAdd={handleAddOption} placeholder={placeholder} options={options} />
          </div>
        </Popover>
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

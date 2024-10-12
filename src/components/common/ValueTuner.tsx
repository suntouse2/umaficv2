import { Check, Edit } from '@mui/icons-material';
import { IconButton, Input, Popover } from '@mui/material';
import { ChangeEvent, KeyboardEvent, memo, useState } from 'react';

type ValueTunerProps = {
  value: string;
  type?: 'string' | 'number';
  onChange: (value: string) => void;
};

export default memo(function ValueTuner({ value, onChange, type = 'string' }: ValueTunerProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [inputValue, setInputValue] = useState<string>(value);

  const openPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closePopover = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === 'string') {
      setInputValue(e.target.value);
    }
    if (type === 'number') {
      const numericValue = e.target.value.replace(/\D/g, '');
      setInputValue(numericValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange(inputValue);
      closePopover();
    }
  };

  return (
    <>
      <span className='flex items-center'>
        <div className='flex items-center'>
          {value}
          <IconButton onClick={openPopover} size='small'>
            <Edit />
          </IconButton>
        </div>
      </span>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <div className='p-1'>
          <Input value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} />
          <IconButton
            onClick={() => {
              onChange(inputValue);
              closePopover();
            }}
            color='success'>
            <Check />
          </IconButton>
        </div>
      </Popover>
    </>
  );
});

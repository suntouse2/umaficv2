import { SlowMotionVideo, GraphicEq, Description } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import VideocamIcon from '@mui/icons-material/Videocam';
import { memo } from 'react';

type SkrepkaProps = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onClick: (type: TMediaTypes) => void;
};

export default memo(function Skrepka({ anchorEl, onClick, onClose }: SkrepkaProps) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} MenuListProps={{ 'aria-labelledby': 'media-button' }}>
      <MenuItem className='flex gap-2' onClick={() => onClick('round')}>
        <SlowMotionVideo />
        Кружочек
      </MenuItem>
      <MenuItem className='flex gap-2' onClick={() => onClick('voice')}>
        <GraphicEq />
        Голосовое
      </MenuItem>
      <MenuItem className='flex gap-2' onClick={() => onClick('auto')}>
        <PhotoIcon />
        Фото
      </MenuItem>
      <MenuItem className='flex gap-2' onClick={() => onClick('auto')}>
        <VideocamIcon />
        Видео
      </MenuItem>
      <MenuItem className='flex gap-2' onClick={() => onClick('document')}>
        <Description />
        Файлом
      </MenuItem>
    </Menu>
  );
});

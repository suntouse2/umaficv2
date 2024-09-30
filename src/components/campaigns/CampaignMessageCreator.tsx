import { useState, useRef, ChangeEvent } from 'react';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { AttachFile, Description, GraphicEq, SlowMotionVideo } from '@mui/icons-material';
import PhotoIcon from '@mui/icons-material/Photo';
import VideocamIcon from '@mui/icons-material/Videocam';
import { toast } from 'react-toastify';

import { Input } from '@components/common/Input';
import TagInput from '@components/common/TagInput';
import TagList from '@components/common/TagList';
import MediaRenderer from '@components/MediaRenderer';

import InputAcceptByMediaType from '@helpers/setInputAttributeByFileType';
import useMediaService from '../../hooks/useMediaService';

type CampaignMessageCreatorProps = {
  data: {
    message: TFunnelMessage;
    order?: number;
    keywords?: string[];
  };
  updateMessage: (data: { message: TFunnelMessage; order?: number; keywords?: string[] }) => void;
  filter_type: 'order' | 'keyword' | 'none';
  onClose?: () => void;
};

export default function CampaignMessageCreator({ data: { order, keywords, message }, updateMessage, onClose, filter_type }: CampaignMessageCreatorProps) {
  const [newOrder, setNewOrder] = useState<number | undefined>(filter_type === 'order' ? order : undefined);
  const [newKeyword, setNewKeyword] = useState<string[]>(filter_type === 'keyword' ? keywords || [] : []);
  const [newMedia, setNewMedia] = useState<TFunnelMessage['media']>(message.media);
  const [newMessage, setNewMessage] = useState<string>(message.message);
  const [lastType, setLastType] = useState<TMediaTypes>('auto');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useMediaService();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const filepath = await uploadFile(file);
    setNewMedia({ filepath, type: lastType });
    e.target.value = '';
  };

  const handleMediaUpdate = (type: TMediaTypes) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = InputAcceptByMediaType(type);
    setLastType(type);
    fileInputRef.current.click();
    handleMenuClose();
  };

  const handleUpdateMessage = () => {
    if (!newMessage && !newMedia) {
      toast.error('Сообщение должно содержать текст или медиа.');
      return;
    }
    if (filter_type === 'keyword' && newKeyword.length === 0) {
      toast.error('Ключевые слова не должны быть пустыми.');
      return;
    }

    const messageData = {
      message: {
        message: newMessage,
        media: newMedia,
      },
      ...(filter_type === 'order' && { order: newOrder }),
      ...(filter_type === 'keyword' && { keywords: newKeyword }),
    };

    updateMessage(messageData);
    onClose?.();
  };

  return (
    <div className='p-2 flex flex-col gap-3'>
      <h2 className='font-bold text-xl mb-4'>Новое сообщение</h2>

      {filter_type === 'order' && <Input min={1} max={99} className='bg-softgray' type='number' value={newOrder?.toString() || ''} onChange={(value) => setNewOrder(Math.max(Number(value), 1))} />}

      {filter_type === 'keyword' && (
        <>
          <TagInput className='!w-full shadow-none !bg-softgray' onAdd={(key) => setNewKeyword((prev) => [...prev, key])} />
          {newKeyword.length > 0 && (
            <div>
              <p className='text-sm'>Ключевые слова:</p>
              <TagList tagClassName='!bg-softgray' className='mt-0' editable value={new Set(newKeyword)} onChange={(tags) => setNewKeyword(Array.from(tags))} />
            </div>
          )}
        </>
      )}

      <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className='text-sm p-2 outline-none w-full min-h-[100px] !bg-softgray' placeholder='Сообщение' />

      <MediaRenderer media={newMedia} />

      <div className='flex mt-2 justify-end'>
        <IconButton onClick={handleMenuClick}>
          <AttachFile />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} MenuListProps={{ 'aria-labelledby': 'media-button' }}>
          <MenuItem className='!p-2 flex gap-2' onClick={() => handleMediaUpdate('round')}>
            <SlowMotionVideo />
            Кружочек
          </MenuItem>
          <MenuItem className='!p-2 flex gap-2' onClick={() => handleMediaUpdate('voice')}>
            <GraphicEq />
            Голосовое
          </MenuItem>
          <MenuItem className='!p-2 flex gap-2' onClick={() => handleMediaUpdate('auto')}>
            <PhotoIcon />
            Фото
          </MenuItem>
          <MenuItem className='!p-2 flex gap-2' onClick={() => handleMediaUpdate('auto')}>
            <VideocamIcon />
            Видео
          </MenuItem>
          <MenuItem className='!p-2 flex gap-2' onClick={() => handleMediaUpdate('document')}>
            <Description />
            Файлом
          </MenuItem>
        </Menu>

        <input ref={fileInputRef} type='file' hidden onChange={handleFileChange} />

        <Button onClick={handleUpdateMessage} variant='outlined' color='secondary'>
          Сохранить
        </Button>
      </div>
    </div>
  );
}

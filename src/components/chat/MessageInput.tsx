import { AttachFile, Delete, Description, GraphicEq, Send, SlowMotionVideo } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import { ChangeEvent, ClipboardEvent, DragEvent, KeyboardEvent, useRef, useState } from 'react';
import PhotoIcon from '@mui/icons-material/Photo';
import VideocamIcon from '@mui/icons-material/Videocam';
import useMediaService from '@hooks/useMediaService';
import InputAcceptByMediaType from '@helpers/setInputAttributeByFileType';
import MediaRenderer from '@components/MediaRenderer';
import { useSendMessage } from '@api/queries';
import { toast } from 'react-toastify';
import { useChat } from '@context/ChatContext';

export default function MessageInput() {
  const { campaignId, currentDirect, addMessageToQueue } = useChat();
  const [message, setMessage] = useState<string>('');
  const [media, setMedia] = useState<TMessageContent['media']>(null);
  const [lastType, setLastType] = useState<TMediaTypes>('auto');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: sendMessage } = useSendMessage();
  const { uploadFile } = useMediaService();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const filepath = await uploadFile(file);
    setMedia({ filepath, type: lastType });
    e.target.value = '';
  };

  const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          const filepath = await uploadFile(file);
          setMedia({ filepath, type: 'auto' });
        }
      }
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const filepath = await uploadFile(file);
    setMedia({ filepath, type: 'auto' });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleMediaUpdate = (type: TMediaTypes) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = InputAcceptByMediaType(type);
    setLastType(type);
    fileInputRef.current.click();
    handleMenuClose();
  };

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!message && !media) {
        toast.error('Сообщение должно содержать текст или медиа.');
        return;
      }
      if (!currentDirect) return;
      const msg = await sendMessage({
        direct_id: currentDirect,
        msg: {
          content: {
            message,
            media,
          },
          reply_to: null,
        },
        campaign_id: campaignId,
      });
      addMessageToQueue(currentDirect, { message, media }, msg.data.catch_slug);
      setMessage('');
      setMedia(null);
    } catch {
      /* empty */
    }
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} onPaste={handlePaste}>
      <div className=' w-full flex p-4 gap-2 items-center'>
        <IconButton onClick={handleMenuClick} sx={{ width: '50px', height: '50px' }}>
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
        <TextField multiline className='w-full' onKeyDown={handleEnter} variant='standard' value={message} onChange={(v) => setMessage(v.target.value)} />
        <Button onClick={handleSendMessage} variant='contained' className='!h-full' endIcon={<Send />}>
          Отправить
        </Button>
        <input ref={fileInputRef} type='file' hidden onChange={handleFileChange} />
      </div>
      <div className='relative group'>
        {media && (
          <div className='absolute top-0 right-0'>
            <IconButton onClick={() => setMedia(null)}>
              <Delete className='hover:text-negative cursor-pointer' />
            </IconButton>
          </div>
        )}
        <MediaRenderer media={media} />
      </div>
    </div>
  );
}

import { AttachFile, Delete, Send } from '@mui/icons-material';
import { Button, IconButton, TextField } from '@mui/material';
import { ChangeEvent, ClipboardEvent, DragEvent, KeyboardEvent, memo, useCallback, useRef, useState } from 'react';
import useMediaService from '@hooks/useMediaService';
import InputAcceptByMediaType from '@helpers/setInputAttributeByFileType';
import MediaRenderer from '@components/MediaRenderer';
import { useSendMessage } from '@api/queries';
import { toast } from 'react-toastify';
import Skrepka from '@components/Skrepka';
import { useParams } from 'react-router-dom';

type SendedMessage = { direct_id: number; content: TMessageContent; catch_slug: string };

type ChatInputProps = {
  onMessageSended?: (msg: SendedMessage) => void;
};

export default memo(function ChatInput({ onMessageSended }: ChatInputProps) {
  console.log('re-rendered');

  const params = useParams();
  const campaignId = Number(params.campaignId);
  const directId = Number(params.directId);

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
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

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

  const handleMediaUpdate = useCallback(
    (type: TMediaTypes) => {
      if (!fileInputRef.current) return;
      fileInputRef.current.accept = InputAcceptByMediaType(type);
      setLastType(type);
      fileInputRef.current.click();
      handleMenuClose();
    },
    [handleMenuClose]
  );

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
      if (!directId) return;
      const msg = await sendMessage({
        direct_id: directId,
        msg: {
          content: {
            message,
            media,
          },
          reply_to: null,
        },
        campaign_id: campaignId,
      });
      if (onMessageSended) {
        onMessageSended({ direct_id: directId, content: { message, media }, catch_slug: msg.data.catch_slug });
      }
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
        <Skrepka anchorEl={anchorEl} onClose={handleMenuClose} onClick={handleMediaUpdate} />
        <TextField multiline className='w-full' onKeyDown={handleEnter} variant='standard' value={message} onChange={(v) => setMessage(v.target.value)} />
        <Button onClick={handleSendMessage} variant='text' className='!h-full'>
          <Send />
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
});

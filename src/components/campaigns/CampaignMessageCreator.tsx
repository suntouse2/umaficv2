import { useState, useRef, ChangeEvent, useCallback, KeyboardEvent } from 'react';
import { Button, IconButton } from '@mui/material';
import { AttachFile, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { Input } from '@components/common/Input';
import TagInput from '@components/common/TagInput';
import TagList from '@components/common/TagList';
import MediaRenderer from '@components/MediaRenderer';

import InputAcceptByMediaType from '@helpers/setInputAttributeByFileType';
import useMediaService from '../../hooks/useMediaService';
import { addTag, addTagList } from '@helpers/tagHelper';
import Skrepka from '@components/Skrepka';

type CampaignMessageCreatorProps = {
  data: {
    message: TFunnelMessage;
    order?: number;
    keywords?: string[];
  };
  updateMessage: (data: { message: TFunnelMessage; order?: number; keywords?: string[] }) => void;
  filter_type: 'order' | 'keyword' | 'none';
  onClose?: () => void;
  maxMsgLength?: number;
};

export default function CampaignMessageCreator({ data: { order, keywords, message }, maxMsgLength, updateMessage, onClose, filter_type }: CampaignMessageCreatorProps) {
  const [newOrder, setNewOrder] = useState<number | undefined>(filter_type === 'order' ? order : undefined);
  const [newKeyword, setNewKeyword] = useState<Set<string>>(filter_type === 'keyword' ? new Set([...(keywords || [])]) : new Set());
  const [newMedia, setNewMedia] = useState<TFunnelMessage['media']>(message.media);
  const [newMessage, setNewMessage] = useState<string>(message.message);
  const [lastType, setLastType] = useState<TMediaTypes>('auto');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useMediaService();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const filepath = await uploadFile(file);
    setNewMedia({ filepath, type: lastType });
    e.target.value = '';
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

  const handleTextAreaKeydown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code == 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleUpdateMessage();
    }
  };

  const handleUpdateMessage = () => {
    if (!newMessage && !newMedia) {
      return toast.error('Сообщение должно содержать текст или медиа.');
    }
    if (filter_type === 'keyword' && newKeyword.size === 0) {
      return toast.error('Ключевые слова не должны быть пустыми.');
    }

    const messageData = {
      message: {
        message: newMessage,
        media: newMedia,
      },
      ...(filter_type === 'order' && { order: newOrder }),
      ...(filter_type === 'keyword' && { keywords: Array.from(newKeyword) }),
    };

    updateMessage(messageData);
    onClose?.();
  };

  return (
    <div className='p-2 flex flex-col gap-3'>
      <h2 className='font-bold text-xl mb-4'>Новое сообщение</h2>

      {filter_type === 'order' && <Input min={2} max={99} className='bg-softgray' type='number' value={newOrder?.toString() || ''} onChange={(value) => setNewOrder(Math.max(Number(value), 2))} />}

      {filter_type === 'keyword' && (
        <>
          <TagInput
            className='!w-full shadow-none !bg-softgray'
            onAdd={(key, list) => {
              if (list == 'single') {
                setNewKeyword((p) => addTag(p, key));
              }
              if (list == 'list') {
                setNewKeyword((p) => addTagList(p, key));
              }
            }}
          />
          {newKeyword.size > 0 && (
            <div>
              <p className='text-sm'>Ключевые слова:</p>
              <TagList tagClassName='!bg-softgray' className='mt-0' editable value={new Set(newKeyword)} onChange={(tags) => setNewKeyword(tags)} />
            </div>
          )}
        </>
      )}

      <textarea onKeyDown={handleTextAreaKeydown} maxLength={maxMsgLength ?? 4096} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className='text-sm p-2 outline-none w-full min-h-[100px] !bg-softgray rounded-lg' placeholder='Сообщение' />

      <div className='relative group'>
        {newMedia && (
          <div className='absolute top-0 right-0'>
            <IconButton onClick={() => setNewMedia(null)}>
              <Delete className='hover:text-negative cursor-pointer' />
            </IconButton>
          </div>
        )}
        <MediaRenderer media={newMedia} />
      </div>

      <div className='flex mt-2 justify-end'>
        <IconButton onClick={handleMenuClick}>
          <AttachFile />
        </IconButton>
        <Skrepka anchorEl={anchorEl} onClose={handleMenuClose} onClick={handleMediaUpdate} />
        <input ref={fileInputRef} type='file' hidden onChange={handleFileChange} />
        <Button onClick={handleUpdateMessage} variant='outlined' color='secondary'>
          Сохранить
        </Button>
      </div>
    </div>
  );
}

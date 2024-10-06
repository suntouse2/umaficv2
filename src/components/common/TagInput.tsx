import { Add, Edit, LibraryBooks } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { KeyboardEvent, memo, useState } from 'react';

type TagInputProps = {
  onAdd: (tag: string, type: 'list' | 'single') => void;
  className?: string;
  onClose?: () => void;
};

export default memo(function TagInput({ onAdd, onClose, className }: TagInputProps) {
  const [tag, setTag] = useState<string>('');
  const [isList, setIsList] = useState<boolean>(false);

  const handleAddTag = () => {
    onAdd(tag, 'single');
    setTag('');
  };

  const handleAddTagList = () => {
    onAdd(tag, 'list');
    setTag('');
  };

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Escape' && onClose) {
      onClose();
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.code === 'Escape' && onClose) {
      onClose();
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className={`flex  px-3 items-start shadow-[0_1px_5px_#0003,0_2px_2px_#00000024,0_3px_1px_-2px_#0000001f] bg-white rounded-md  min-w-60 w-max ${className}`}>
      {!isList && <input onKeyDown={handleInputKeyDown} value={tag} onBlur={handleAddTag} onChange={(e) => setTag(e.target.value)} className='w-full mt-[9px] bg-[inherit] outline-none text-sm' placeholder={'введите фразу'} />}
      {isList && <textarea onKeyDown={handleTextareaKeyDown} value={tag} onBlur={handleAddTagList} onChange={(e) => setTag(e.target.value)} className='w-full min-h-40 mt-2 outline-none text-sm' placeholder={'вставьте список'} />}
      <IconButton onClick={() => (isList ? handleAddTagList() : handleAddTag())}>
        <Add />
      </IconButton>
      <IconButton onClick={() => setIsList((list) => !list)}>{isList ? <Edit /> : <LibraryBooks />}</IconButton>
    </div>
  );
});

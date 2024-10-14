import { changeTag, deleteTag } from '@helpers/tagHelper';
import { Close, Delete, TaskAlt } from '@mui/icons-material';
import { IconButton, Input, Popover } from '@mui/material';
import { useState, KeyboardEvent } from 'react';

type TagListDefaultProps = {
  value: Set<string>;
  className?: string;
  tagClassName?: string;
};

type TagListProps = ({ editable: true; onChange?: (value: Set<string>) => void } & TagListDefaultProps) | ({ editable: false } & TagListDefaultProps);

export default function TagList(props: TagListProps) {
  const { value, editable, className, tagClassName } = props;
  const onChange = editable == true ? props.onChange : undefined;

  const [input, setInput] = useState<string>('');
  const [currentEditingTag, setCurrentEditingTag] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleChangeTag = () => {
    if (!currentEditingTag || !editable || onChange == undefined) return;
    onChange(changeTag(value, currentEditingTag, input));
    closeEditor();
  };

  const handleRemoveTag = () => {
    if (!currentEditingTag || !editable || onChange == undefined) return;
    onChange(deleteTag(value, currentEditingTag));
    closeEditor();
  };

  const openEditor = (tag: string, event: React.MouseEvent<HTMLElement>) => {
    setInput(tag);
    setCurrentEditingTag(tag);
    setAnchorEl(event.currentTarget);
  };

  const closeEditor = () => {
    setInput('');
    setAnchorEl(null);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      handleChangeTag();
    }
  };

  return (
    <>
      <ul className={`${className} flex w-full mt-3 gap-2 flex-wrap`}>
        {value.size > 0 &&
          Array.from(value).map((tag) => (
            <li onClick={(event) => openEditor(tag, event)} className={`relative bg-inputbg text-sm px-5 py-2 rounded-full flex justify-between items-center mt-1 cursor-pointer ${tagClassName}`} key={tag}>
              {tag}
            </li>
          ))}
      </ul>

      {editable && currentEditingTag && (
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={closeEditor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}>
          <div onClick={(e) => e.stopPropagation()} className='w-max flex z-20 bg-white p-2 shadow-[0_1px_5px_#0003,0_2px_2px_#00000024,0_3px_1px_-2px_#0000001f]'>
            <Input onKeyDown={handleInputKeyDown} value={input} onChange={(e) => setInput(e.target.value)} className='w-44' />
            <IconButton onClick={closeEditor}>
              <Close />
            </IconButton>
            <IconButton onClick={handleRemoveTag}>
              <Delete color='error' />
            </IconButton>
            <IconButton onClick={handleChangeTag}>
              <TaskAlt color='success' />
            </IconButton>
          </div>
        </Popover>
      )}
    </>
  );
}

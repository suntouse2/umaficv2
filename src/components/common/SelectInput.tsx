import { KeyboardEvent, memo, useMemo, useState } from 'react';
import startSame from '@helpers/startSame';

type SelectInputProps = {
  placeholder: string;
  options: Map<string, string>;
  onAdd: (key: string) => void;
  onClose?: () => void;
};

export default memo(function SelectInput({ placeholder, options, onClose, onAdd }: SelectInputProps) {
  const [filter, setFilter] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredOptions = useMemo(() => {
    if (filter.length == 0) return [];
    return Array.from(options).filter((option) => startSame(option[1], filter));
  }, [options, filter]);

  const handleAddOption = (key: string) => {
    onAdd(key);
    setFilter('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' && selectedIndex !== null) {
      const selectedOption = filteredOptions[selectedIndex];
      if (selectedOption) {
        handleAddOption(selectedOption[0]);
      }
    } else if (e.code === 'ArrowDown') {
      setSelectedIndex((prev) => (prev === null ? 0 : Math.min(prev + 1, filteredOptions.length - 1)));
    } else if (e.code === 'ArrowUp') {
      setSelectedIndex((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    } else if (e.code === 'Escape' && onClose) {
      onClose();
    }
  };

  return (
    <div>
      <input onKeyDown={handleKeyDown} value={filter} onChange={(e) => setFilter(e.target.value)} className='w-full outline-none text-sm' placeholder={placeholder} />
      {filteredOptions.length > 0 && (
        <ul className='mt-1 max-h-64 overflow-auto border-t-softgray border-t-[1px]'>
          {filteredOptions.map((option, index) => (
            <li onClick={() => handleAddOption(option[0])} className={`p-1 text-sm mt-1 cursor-pointer hover:bg-softgray ${selectedIndex === index ? 'bg-softgray' : ''}`} key={option[0]}>
              {option[1]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

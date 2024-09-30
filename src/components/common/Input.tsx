import { ChangeEvent, KeyboardEvent } from 'react';

type InputProps = {
  resize?: boolean;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  type?: string;
};

export function Input({ value, onChange, onKeyDown, placeholder, resize = false, min, max, type, className }: InputProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      {resize === false && <input min={min} max={max} type={type ?? 'text'} placeholder={placeholder ?? ''} className={'bg-inputbg text-sm p-2 font-normal leading-7 rounded-lg outline-none ' + className} value={value ?? ''} onChange={handleInputChange} onKeyDown={onKeyDown} />}
      {resize === true && <textarea placeholder={placeholder ?? ''} className={'bg-inputbg text-sm p-2 font-normal leading-7 rounded-lg outline-none ' + className} value={value} onChange={handleTextAreaChange} onKeyDown={onKeyDown} />}
    </>
  );
}

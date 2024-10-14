import { ChangeEvent, KeyboardEvent } from 'react';

type InputProps = {
  resize?: boolean;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  type?: string;
  onlyDigits?: boolean;
};

export function Input({ value, onChange, onKeyDown, onBlur, placeholder, onlyDigits = false, resize = false, min, max, type, className }: InputProps) {
  const handleInputBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
    }
  };
  const handleTextAreaBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onlyDigits == true) {
      const numericValue = e.target.value.replace(/\D/g, '');
      return onChange(numericValue);
    }
    onChange(e.target.value);
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onlyDigits == true) {
      const numericValue = e.target.value.replace(/\D/g, '');
      return onChange(numericValue);
    }
    onChange(e.target.value);
  };

  return (
    <>
      {resize === false && <input onBlur={handleInputBlur} min={min} max={max} type={type ?? 'text'} placeholder={placeholder ?? ''} className={'bg-inputbg text-sm p-2 font-normal leading-7 rounded-lg outline-none ' + className} value={value ?? ''} onChange={handleInputChange} onKeyDown={onKeyDown} />}
      {resize === true && <textarea onBlur={handleTextAreaBlur} placeholder={placeholder ?? ''} className={'bg-inputbg text-sm p-2 font-normal leading-7 rounded-lg outline-none ' + className} value={value} onChange={handleTextAreaChange} onKeyDown={onKeyDown} />}
    </>
  );
}

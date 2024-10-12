import { Avatar } from '@mui/material';
import { ChangeEvent, useRef } from 'react';

type AvatarProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function AvatarInput({ file, onChange }: AvatarProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files && e.target.files[0];
      if (file) onChange(file);
    } catch {
      onChange(null);
    }
  };

  return (
    <>
      <Avatar src={(file && URL.createObjectURL(file)) ?? ''} onClick={handleAvatarClick} sx={{ width: 120, height: 120 }} />
      <input multiple={false} onChange={handleFileChange} accept='image/*' ref={fileRef} type='file' style={{ display: 'none' }} />
    </>
  );
}

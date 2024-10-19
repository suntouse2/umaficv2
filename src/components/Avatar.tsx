import { useEffect, useState } from 'react';
import useMediaService from '../hooks/useMediaService';
import AvatarInput from '@components/common/AvatarInput';

type AvatarProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export default function CampaignAvatar({ value, onChange }: AvatarProps) {
  const [file, setFile] = useState<File | null>(null);
  const { getFile, uploadFile } = useMediaService();

  useEffect(() => {
    if (value) getFile(value).then((file) => setFile(file));
  }, [getFile, value]);

  const handleFileChange = async (file: File | null) => {
    if (!file) return onChange(null);
    if (file) {
      const filepath = await uploadFile(file);
      onChange(filepath);
    }
  };

  return <AvatarInput file={file} onChange={handleFileChange} />;
}

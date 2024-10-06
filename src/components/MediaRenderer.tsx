import { memo, useEffect, useState } from 'react';

import FileViewer from '@components/FileViewer';
import useMediaService from '@hooks/useMediaService';
import { CircularProgress } from '@mui/material';

export default memo(function MediaRenderer({ media }: { media: TFunnelMessage['media'] }) {
  const [file, setFile] = useState<File | null>(null);
  const { getFile } = useMediaService();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    let isMounted = true;
    if (media && media.filepath) {
      getFile(media.filepath).then((fileData) => {
        if (isMounted) {
          setFile(fileData);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [getFile, media]);

  if (!file) {
    return null;
  }
  if (!media) return <></>;
  return (
    <>
      {loading && 'Загрузка'}
      {loading && <CircularProgress className='mt-10' color='primary' />}
      {!loading && <FileViewer file={file} mediaType={media.type} />}
    </>
  );
});

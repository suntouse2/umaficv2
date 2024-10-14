import { memo, useCallback, useEffect, useState } from 'react';
import FileViewer from '@components/FileViewer';
import useMediaService from '@hooks/useMediaService';
import { CircularProgress } from '@mui/material';

export default memo(function MediaRenderer({ media }: { media: TFunnelMessage['media'] }) {
  const [file, setFile] = useState<File | null>(null);
  const { getFile } = useMediaService();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFile = useCallback(async () => {
    try {
      setLoading(true);
      if (!media) throw new Error('no media');
      const file = await getFile(media?.filepath);
      setFile(file);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [getFile, media]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  return (
    <>
      {media && loading && <CircularProgress className='mt-10' color='primary' />}
      {media && !loading && file && <FileViewer file={file} mediaType={media.type} />}
    </>
  );
});

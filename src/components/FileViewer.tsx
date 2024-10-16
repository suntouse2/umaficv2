import RoundVideo from '@components/common/RoundVideo';
import Voice from '@components/common/Voice';
import { Description, Download } from '@mui/icons-material';
import { memo, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import Video from '@components/common/Video';

type FileViewerProps = {
  file: File;
  mediaType?: TMediaTypes;
};

export default memo(function FileViewer({ file, mediaType }: FileViewerProps) {
  const type = file.type.split('/')[0];

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = blobUrl ?? '';
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let content;

  const fileNameSplit = file.name.split('.');

  if (blobUrl) {
    if (mediaType === 'voice') {
      content = <Voice audioFile={file} blob={blobUrl} />;
    } else if (mediaType === 'round') {
      content = <RoundVideo blob={blobUrl} />;
    } else if (file.type === 'application/octet-stream') {
      content = <img className='w-full h-full object-cover' src={blobUrl} alt={file.name} />;
    } else if (file.type === 'video/webm') {
      content = <video loop autoPlay muted className='w-full h-full overflow-hidden' src={blobUrl}></video>;
    } else if (type === 'video' && (mediaType === 'auto' || mediaType === 'document')) {
      content = <Video blob={blobUrl}></Video>;
    } else if (type === 'audio') {
      content = <audio controls src={blobUrl} />;
    } else {
      content = (
        <div className='flex bg-white rounded-full justify-between items-center p-2'>
          <p className='flex  text-sm p-2 max-w-80 overflow-hidden'>
            <Description />
            {fileNameSplit[0].slice(0, 5) + '....' + fileNameSplit[fileNameSplit.length - 1]}
          </p>
          <IconButton onClick={handleDownload}>
            <Download />
          </IconButton>
        </div>
      );
    }
  } else {
    content = null;
  }

  return (
    <div style={{ width: '190px', height: '190px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
      {content}
    </div>
  );
});

import RoundVideo from '@components/common/RoundVideo';
import Voice from '@components/common/Voice';
import { Description, Download } from '@mui/icons-material';
import { memo } from 'react';
import { IconButton } from '@mui/material';

type FileViewerProps = {
  file: File;
  mediaType?: TMediaTypes;
};

export default memo(function FileViewer({ file, mediaType }: FileViewerProps) {
  const type = file.type.split('/')[0];
  const blob = URL.createObjectURL(file);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = blob;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Убираем элемент после клика
  };

  return (
    <div className='w-max' onClick={(e) => e.stopPropagation()}>
      <>
        {mediaType == 'voice' && <Voice audioFile={file} blob={blob} />}
        {mediaType == 'round' && <RoundVideo blob={blob} />}
        {type == 'video' && mediaType == 'auto' && <video controls className='w-full max-w-64' src={blob}></video>}
        {type == 'image' && mediaType == 'auto' && <img className='w-full max-w-64' src={blob}></img>}
        {type == 'video' && mediaType == 'document' && <video loop muted autoPlay className='w-full max-w-64' src={blob}></video>}
        {type !== 'video' && mediaType == 'document' && (
          <>
            {(file.name.endsWith('.webp') || type == 'image') && <img className='w-full max-w-64' src={blob} />}
            {type == 'audio' && <audio controls src={blob} />}
            {type == 'application' && !file.name.endsWith('.webp') && (
              <div className='flex items-center'>
                <p className='flex text-sm p-2 max-w-80 overflow-hidden'>
                  <Description />
                  {file.name.split('.')[0].slice(0, 10) + '.' + file.name.split('.')[file.name.split('.').length - 1]}
                </p>
                <IconButton onClick={handleDownload}>
                  <Download />
                </IconButton>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
});

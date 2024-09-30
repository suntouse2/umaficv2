import RoundVideo from '@components/common/RoundVideo';
import Voice from '@components/common/Voice';
import { memo } from 'react';
type FileViewerProps = {
  file: File;
  mediaType?: TMediaTypes;
  disableAnimation?: boolean;
};

export default memo(function FileViewer({ file, mediaType }: FileViewerProps) {
  const type = file.type.split('/')[0];
  const blob = URL.createObjectURL(file);

  return (
    <div className='w-max' onClick={(e) => e.stopPropagation()}>
      <>
        {mediaType == 'voice' && <Voice audioFile={file} blob={blob} />}
        {mediaType == 'round' && <RoundVideo blob={blob} />}
        {type == 'video' && mediaType == 'auto' && <video className='w-full max-w-64' controls src={blob}></video>}
        {type == 'image' && mediaType == 'auto' && <img className='w-full max-w-64' src={blob}></img>}
        {type == 'video' && mediaType == 'document' && <video className='w-full max-w-64' controls src={blob}></video>}
        {type !== 'video' && mediaType == 'document' && <p>{file.name}</p>}
      </>
    </div>
  );
});

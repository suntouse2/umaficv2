import { PlayArrow } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useRef, useEffect, useState, memo } from 'react';

type VideoProps = {
  blob: string;
};

export default memo(function Video({ blob }: VideoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [dialogState, setDialogState] = useState<boolean>(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video && canvas) {
      video.src = blob;
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 0.1;
      };

      video.onseeked = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        }
      };
    }
  }, [blob]);

  return (
    <div className='relative w-full h-full cursor-pointer'>
      <Dialog open={dialogState} onClose={() => setDialogState(false)}>
        <video className='w-full h-full max-h-[700px]' autoPlay src={blob} controls></video>
      </Dialog>
      <div className='absolute w-full h-full flex items-center justify-center'>
        <IconButton onClick={() => setDialogState(true)} className='!text-white' size='large'>
          <PlayArrow fontSize='large' />
        </IconButton>
      </div>
      <video ref={videoRef} className='hidden w-full h-full' />
      <canvas className='w-full h-full object-cover' ref={canvasRef} />
    </div>
  );
});

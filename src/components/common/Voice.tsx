import { memo, useEffect, useRef, useState } from 'react';

type AudioAnalyzerProps = {
  audioFile: File | null;
  blob: string;
};

import { processAudioFile } from '@helpers/waveform';
import { IWaveformProps, renderWaveform } from '@components/helpers/WaveForm';
import { Pause, PlayArrow } from '@mui/icons-material';

export default memo(function Voice({ audioFile, blob }: AudioAnalyzerProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [spikes, setSpikes] = useState<number[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(false);

  useEffect(() => {
    if (audioFile) {
      processAudioFile(audioFile)
        .then((data) => {
          if (data?.data) {
            setSpikes(data.data);
          }
        })
        .catch(() => alert('а'));
    }
  }, [audioFile]);

  const handlePlay = () => {
    if (play) {
      setPlay(false);
      audioRef.current?.pause();
      if (audioRef.current?.currentTime) audioRef.current.currentTime = 0;
    } else {
      setPlay(true);
      audioRef.current?.play();
    }
  };

  useEffect(() => {
    if (canvas.current && spikes.length > 0) {
      const waveformProps: IWaveformProps = {
        peak: Math.max(...spikes),
        fillStyle: 'rgb(193, 193, 193)',
        progressFillStyle: '#568ce1',
      };

      renderWaveform(canvas.current, spikes, progress, waveformProps);
    }
  }, [spikes, progress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        setProgress(audio.currentTime / audio.duration);
      };

      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
  }, []);

  return (
    <div className='bg-inputbg px-2 w-max rounded-md'>
      <div className='flex gap-2'>
        <button
          className={play ? 'text-primary' : 'text-softgray3'}
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}>
          {play ? <Pause /> : <PlayArrow />}
        </button>
        <canvas ref={canvas}></canvas>
      </div>
      <audio controls ref={audioRef} style={{ display: 'none' }} src={blob}></audio>
    </div>
  );
});

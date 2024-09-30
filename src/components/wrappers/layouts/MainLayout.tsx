import { PropsWithChildren, useCallback, useState } from 'react';
import Aside from '@components/Aside';
import Header from '@components/Header';
import getBreakpoints from '@static/mediaBreakpoints';

type MainLayoutProps = {
  isNeedHeader?: boolean;
  isNeedAside?: boolean;
} & PropsWithChildren;

export default function MainLayout({ isNeedAside = true, isNeedHeader = true, children }: MainLayoutProps) {
  const [asideState, setAsideState] = useState<boolean>(window.innerWidth < getBreakpoints(false)?.md ? false : true);

  const switchAsideState = useCallback(() => setAsideState((prev) => !prev), []);
  const changeAsideState = useCallback((state: boolean) => setAsideState(state), []);

  return (
    <div className={`grid w-dvw h-dvh overflow-hidden  grid-cols-[1fr] ${!asideState ? 'md:grid-cols-[0fr,1fr]' : 'md:grid-cols-[max-content,1fr]'}`}>
      {isNeedAside && (
        <div className='overflow-hidden'>
          <Aside asideState={asideState} onChange={changeAsideState} />
        </div>
      )}
      <div className='grid h-dvh w-full overflow-hidden grid-rows-[max-content,1fr]'>
        {isNeedHeader && <Header asideToggleCallback={switchAsideState} />}
        {children}
      </div>
    </div>
  );
}

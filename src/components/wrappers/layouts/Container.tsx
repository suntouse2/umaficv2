import { PropsWithChildren } from 'react';

export default function Container({ children }: PropsWithChildren) {
  return <div className='relative h-full w-full overflow-auto max-w-[1020px] mx-auto p-5'>{children}</div>;
}

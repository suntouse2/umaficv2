import { PropsWithChildren } from 'react';

type BubbleProps = {
  onClick?: () => void;
  className?: string;
} & PropsWithChildren;

export default function Bubble({ children, className, onClick }: BubbleProps) {
  return (
    <div onClick={onClick} className={`border shadow-[0_0_5px_1px_#f2f3f7] rounded-xl cursor-pointer bg-white border-solid border-border dark:bg-dark2 p-6 ${className}`}>
      {children}
    </div>
  );
}

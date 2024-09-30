/* eslint-disable react-refresh/only-export-components */
import { createContext, PropsWithChildren, useContext, useState } from 'react';

type TChatContext = {
  campaignId: number;
  currentDirect: number | null;
  setCurrentDirect: (id: number) => void;
};

export const chatContext = createContext<TChatContext | null>(null);

export function ChatProvider({ children, id }: PropsWithChildren & { id: number }) {
  const [currentDirect, setCurrentDirectState] = useState<number | null>(null);
  const setCurrentDirect = (id: number) => setCurrentDirectState(id);

  return <chatContext.Provider value={{ currentDirect, setCurrentDirect, campaignId: id }}>{children}</chatContext.Provider>;
}

export function useChat() {
  const context = useContext(chatContext);
  if (!context) throw new Error('Отсутствует ChatProvider');

  return context;
}

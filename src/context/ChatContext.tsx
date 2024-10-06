/* eslint-disable react-refresh/only-export-components */
import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';

type TChatContext = {
  campaignId: number;
  currentDirect: number | null;
  setCurrentDirect: (id: number | null) => void;
  addMessageToQueue: (direct_id: number, content: TMessageContent, catch_slug: string) => void;
  removeMessageFromQueue: (catch_slug: string) => void;
  messagesQueue: {
    direct_id: number;
    content: TMessageContent;
    catch_slug: string;
  }[];
};

export const chatContext = createContext<TChatContext | null>(null);

export function ChatProvider({ children, id }: PropsWithChildren & { id: number }) {
  const [currentDirect, setCurrentDirectState] = useState<number | null>(null);
  const setCurrentDirect = (id: number | null) => setCurrentDirectState(id);
  const [messagesQueue, setMessagesQueue] = useState<
    {
      direct_id: number;
      content: TMessageContent;
      catch_slug: string;
    }[]
  >([]);

  const addMessageToQueue = useCallback((direct_id: number, content: TMessageContent, catch_slug: string) => {
    setMessagesQueue((prev) => [...prev, { direct_id, content, catch_slug }]);
  }, []);
  const removeMessageFromQueue = useCallback((catch_slug: string) => {
    setMessagesQueue((prev) => [...prev.filter((msg) => msg.catch_slug !== catch_slug)]);
  }, []);

  return <chatContext.Provider value={{ messagesQueue, addMessageToQueue, removeMessageFromQueue, currentDirect, setCurrentDirect, campaignId: id }}>{children}</chatContext.Provider>;
}

export function useChat() {
  const context = useContext(chatContext);
  if (!context) throw new Error('Отсутствует ChatProvider');

  return context;
}

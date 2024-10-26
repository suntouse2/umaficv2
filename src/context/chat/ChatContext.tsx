import DirectService from '@api/http/services/chat/DirectService';
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react';

type ChatProviderProps = {
  directId: number | null;
  campaignId: number;
};

type TChatContext = {
  directs: TChatDirectsResponse;
  currentDirect: TChatDirectResponse | null;
  fetchNextDirects: () => Promise<void>;
  fetchNextMessages: () => Promise<void>;
  isFavorite: boolean;
  setDirectFavorite: (direct_id: number, isFavorite: boolean) => Promise<void>;
  setIsFavorite: (isFavorite: boolean) => void;
  messages: TChatDirectMessagesResponse;
  directId: number | null;
  readMessage: (direct_id: number, msg_id: number) => Promise<void>;
  campaignId: number;
  sendMessage: (msg: TChatSendMessage) => Promise<{ catch_slug: string } | undefined>;
};

const chatContext = createContext<TChatContext | null>(null);

export function ChatProvider({ children, campaignId, directId }: PropsWithChildren<ChatProviderProps>) {
  const wsRef = useRef<WebSocket | null>(null);
  const directIdRef = useRef(directId);

  useEffect(() => {
    directIdRef.current = directId;
  }, [directId]);

  useEffect(() => {
    const wsUrl = `${import.meta.env.VITE_WS_URL}/directs/messages?campaign_id=${campaignId}&token=${localStorage.getItem('access_token')}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const currentDirectId = directIdRef.current;

      if (data) {
        const wsMsg = data as TChatMessage & { direct_id: number };

        setDirects((directs) => {
          const updatedDirects = directs.map((direct) => {
            if (direct.id === wsMsg.direct_id) {
              const updatedDirect = { ...direct, last_message: wsMsg };
              if (direct.id !== currentDirectId && wsMsg.is_self == false) {
                updatedDirect.unread_count = (updatedDirect.unread_count ?? 0) + 1;
              }
              return updatedDirect;
            }
            return direct;
          });

          const direct = updatedDirects.find((d) => d.id === wsMsg.direct_id);
          if (direct) {
            return [direct, ...updatedDirects.filter((d) => d.id !== wsMsg.direct_id)];
          }
          return updatedDirects;
        });

        setMessagesCache((currentMessages) => {
          if (!currentMessages[wsMsg.direct_id]) {
            return currentMessages;
          }

          const messages = currentMessages[wsMsg.direct_id];
          if (wsMsg.is_self) {
            const indexOfTempMessage = messages.findIndex((tempMessage) => tempMessage.catch_slug === wsMsg.catch_slug);

            if (indexOfTempMessage !== -1) {
              const updatedMessages = [...messages];
              updatedMessages[indexOfTempMessage] = wsMsg;
              return { ...currentMessages, [wsMsg.direct_id]: updatedMessages };
            } else {
              return { ...currentMessages, [wsMsg.direct_id]: [...messages, wsMsg] };
            }
          } else {
            return { ...currentMessages, [wsMsg.direct_id]: [...messages, wsMsg] };
          }
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [campaignId]);

  const [directsPage, setDirectsPage] = useState<number>(1);
  const [messagesPage, setMessagesPage] = useState<{ [key: number]: number }>({});
  const [directs, setDirects] = useState<TChatDirectsResponse>([]);
  const [messagesCache, setMessagesCache] = useState<{ [key: number]: TChatDirectMessagesResponse }>({});
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [currentDirect, setCurrentDirect] = useState<TChatDirectResponse | null>(null);
  const [hasNextDirectPage, setHasNextDirectPage] = useState<boolean>(true);
  const messages = useMemo(() => {
    if (!directId) return [];
    return messagesCache[directId] ?? [];
  }, [directId, messagesCache]);

  const setDirectFavorite = useCallback(
    async (direct_id: number, isFavorite: boolean) => {
      try {
        await DirectService.updateDirect(direct_id, { is_favorite: isFavorite });
        if (currentDirect && currentDirect.id === direct_id) {
          setCurrentDirect((direct) => (direct ? { ...direct, is_favorite: isFavorite } : direct));
        }
        setDirects((directs) => directs.map((direct) => (direct.id === direct_id ? { ...direct, is_favorite: isFavorite } : direct)));
      } catch (error) {
        console.error('Error updating favorite status:', error);
      }
    },
    [currentDirect]
  );

  const fetchNextDirects = useCallback(async () => {
    if (!hasNextDirectPage) return;
    const page = directsPage + 1;
    setDirectsPage(page);
    const params = isFavorite ? { is_favorite: true } : undefined;
    const { data } = await DirectService.getDirects(campaignId, page, params);
    if (data.length > 0) {
      setDirects((prevDirects) => [...prevDirects, ...data]);
    } else {
      setHasNextDirectPage(false);
    }
  }, [hasNextDirectPage, directsPage, isFavorite, campaignId]);

  const fetchDirects = useCallback(async () => {
    const page = 1;
    setHasNextDirectPage(true);
    setDirectsPage(page);
    const params = isFavorite ? { is_favorite: true } : undefined;
    const { data } = await DirectService.getDirects(campaignId, page, params);
    setDirects(data);
  }, [campaignId, isFavorite]);

  useEffect(() => {
    fetchDirects();
  }, [fetchDirects, isFavorite]);

  const readMessage = useCallback(async (direct_id: number, msg_id: number) => {
    try {
      await DirectService.readMessage(direct_id, msg_id);
      setMessagesCache((msgs) => ({ ...msgs, [direct_id]: [...msgs[direct_id].map((msg) => (msg.id == msg_id ? { ...msg, is_read: true } : msg))] }));
      setDirects((directs) => directs.map((direct) => (direct.id === direct_id ? { ...direct, unread_count: 0 } : direct)));
    } catch {
      //
    }
  }, []);

  const sendMessage = useCallback(
    async (msg: TChatSendMessage) => {
      try {
        if (!directId) return;
        const { data } = await DirectService.sendMessage(directId, msg);
        const sendingMessage: TChatMessage = {
          id: -1,
          catch_slug: data.catch_slug,
          content: msg.content,
          is_self: true,
          date: '',
          is_read: true,
          is_auto_reply: false,
          forwarded_message: null,
          reply_to: null,
        };

        setDirects((directs) => {
          const updatedDirects = directs.map((direct) => (direct.id === directId ? { ...direct, last_message: sendingMessage } : direct));
          const direct = updatedDirects.find((d) => d.id === directId);
          if (direct) {
            return [direct, ...updatedDirects.filter((d) => d.id !== directId)];
          }
          return updatedDirects;
        });

        setMessagesCache((messages) => ({
          ...messages,
          [directId]: [...(messages[directId] ?? []), sendingMessage],
        }));
        return data;
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [directId]
  );

  const fetchNextMessages = useCallback(async () => {
    if (!directId) return;

    const currentPage = messagesPage[directId] ?? 0;
    const page = currentPage + 1;

    setMessagesPage((msgPages) => ({ ...msgPages, [directId]: page }));
    const { data } = await DirectService.getDirectMessages(directId, page);
    if (data.length > 0) {
      setMessagesCache((msgs) => ({
        ...msgs,
        [directId]: [...data.reverse(), ...(msgs[directId] ?? [])],
      }));
    }
  }, [directId, messagesPage]);

  const fetchMessages = useCallback(async () => {
    if (!directId) return;

    if (messagesCache[directId] === undefined) {
      const page = 1;
      setMessagesPage((msgPages) => ({ ...msgPages, [directId]: page }));
      const { data } = await DirectService.getDirectMessages(directId, page);

      setMessagesCache((msgs) => ({
        ...msgs,
        [directId]: data.reverse(),
      }));
    }
  }, [directId, messagesCache]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!directId) {
      setCurrentDirect(null);
      return;
    }
    DirectService.getDirect(directId).then((direct) => setCurrentDirect(direct.data));
    fetchMessages();
  }, [directId, fetchMessages]);

  return (
    <chatContext.Provider
      value={{
        readMessage,
        setDirectFavorite,
        isFavorite,
        setIsFavorite,
        sendMessage,
        directs,
        messages,
        campaignId,
        directId,
        fetchNextDirects,
        fetchNextMessages,
        currentDirect,
      }}>
      {children}
    </chatContext.Provider>
  );
}

// Custom hook to use the chat context
// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const context = useContext(chatContext);

  if (!context) throw new Error('ChatProvider is missing');
  return context;
}

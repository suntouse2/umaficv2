import DirectService from '@api/http/services/chat/DirectService';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

//временный говнокод, потом мб подключу библиотеки или перепишу (ну хотя как говнокод, много кода и функций а так в целом че? идите нахуй ахуенный контекст, работает все збс )

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

export function ChatProvider({ children, campaignId, directId }: PropsWithChildren & ChatProviderProps) {
  const { lastJsonMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}/directs/messages?campaign_id=${campaignId}&token=${localStorage.getItem('access_token')}`);

  const [directsPage, setDirectsPage] = useState<number>(1);
  const [messagesPage, setMessagesPage] = useState<{ [key: number]: number }>({});

  const [directs, setDirects] = useState<TChatDirectsResponse>([]);
  const [messagesCache, setMessagesCache] = useState<{ [key: number]: TChatDirectMessagesResponse }>({});

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const messages = useMemo(() => {
    if (!directId) return [];
    return messagesCache[directId] ?? [];
  }, [directId, messagesCache]);

  const [currentDirect, setCurrentDirect] = useState<TChatDirectResponse | null>(null);

  const effectRan = useRef(false);

  //directs

  const setDirectFavorite = useCallback(
    async (direct_id: number, isFavorite: boolean) => {
      try {
        await DirectService.updateDirect(direct_id, { is_favorite: isFavorite });
        if (currentDirect && currentDirect.id === direct_id) {
          setCurrentDirect((direct) => {
            if (!direct) return direct;

            return { ...direct, is_favorite: isFavorite };
          });
        }
        setDirects((directs) => [...directs.map((direct) => ({ ...direct, is_favorite: isFavorite }))]);
      } catch {
        //
      }
    },
    [currentDirect]
  );

  const fetchNextDirects = useCallback(async () => {
    const page = directsPage + 1;
    setDirectsPage(page);
    const { data } = await DirectService.getDirects(campaignId, page, isFavorite ? { is_favorite: true } : undefined);
    if (data.length > 0) {
      setDirects((directs) => [...directs, ...data]);
    }
  }, [directsPage, campaignId, isFavorite]);

  const fetchDirects = useCallback(async () => {
    const page = 1;
    setDirectsPage(1);
    const { data } = await DirectService.getDirects(campaignId, page, isFavorite ? { is_favorite: true } : undefined);
    setDirects([...data]);
  }, [campaignId, isFavorite]);

  useEffect(() => {
    fetchDirects();
  }, [fetchDirects, isFavorite]);

  //messages

  const readMessage = useCallback(async (direct_id: number, msg_id: number) => {
    await DirectService.readMessage(direct_id, msg_id);
    setDirects((directs) => [...directs.map((direct) => (direct.id == direct_id ? { ...direct, unread_count: 0 } : direct))]);
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
          const directIndex = directs.findIndex((direct) => direct.id == directId);
          const direct = { ...directs[directIndex] };
          if (direct) {
            direct.last_message = sendingMessage;
          }
          if (directIndex !== -1) {
            {
              return [direct, ...directs.slice(0, directIndex), ...directs.slice(directIndex + 1)];
            }
          }
          return directs;
        });
        setMessagesCache((messages) => ({ ...messages, [directId]: [...messages[directId], sendingMessage] }));
        return data;
      } catch {
        //nothing
      }
    },
    [directId]
  );

  const fetchNextMessages = useCallback(async () => {
    if (!directId) return;

    const page = messagesPage[directId] + 1;

    setMessagesPage((msgPages) => {
      return { ...msgPages, [directId]: page };
    });
    const { data } = await DirectService.getDirectMessages(directId, page);
    if (data.length > 0) {
      setMessagesCache((msgs) => ({ ...msgs, [directId]: [...data.reverse(), ...msgs[directId]] }));
    }
  }, [directId, messagesPage]);

  const fetchMessages = useCallback(async () => {
    if (!directId) return;

    const cachedMessages = messagesCache[directId];
    if (cachedMessages === undefined) {
      const page = 1;
      setMessagesPage((msgPages) => ({ ...msgPages, [directId]: 1 }));
      const { data } = await DirectService.getDirectMessages(directId, page);

      setMessagesCache((msgs) => ({
        ...msgs,
        [directId]: data.reverse(),
      }));
    }
  }, [directId, messagesCache]);

  //fetch
  useEffect(() => {
    if (effectRan.current === false) {
      fetchDirects();
      fetchMessages();
      effectRan.current = true;
    }
  }, [fetchDirects, fetchMessages]);

  useEffect(() => {
    if (!directId) return setCurrentDirect(null);
    DirectService.getDirect(directId).then((direct) => setCurrentDirect(direct.data));
    fetchMessages();
  }, [directId, fetchMessages]);

  //ws
  useEffect(() => {
    if (lastJsonMessage !== null) {
      const wsMsg = lastJsonMessage as TChatMessage & { direct_id: number };

      setDirects((directs) => {
        const directIndex = directs.findIndex((direct) => direct.id == wsMsg.direct_id);
        const direct = { ...directs[directIndex] };
        if (direct) {
          direct.last_message = wsMsg;
        }
        if (direct.id !== directId) {
          direct.unread_count = direct.unread_count + 1;
        }
        if (directIndex !== -1) {
          {
            return [direct, ...directs.slice(0, directIndex), ...directs.slice(directIndex + 1)];
          }
        }
        return directs;
      });
      setMessagesCache((currentMessages) => {
        if (!currentMessages[wsMsg.direct_id]) {
          console.log('messages by this dialog cache not loaded');

          return currentMessages;
        }

        if (!wsMsg.is_self) {
          return { ...currentMessages, [wsMsg.direct_id]: [...currentMessages[wsMsg.direct_id], wsMsg] };
        }

        if (wsMsg.is_self) {
          const indexOfTempMessage = currentMessages[wsMsg.direct_id].findIndex((tempMessage) => tempMessage.catch_slug === wsMsg.catch_slug);

          if (indexOfTempMessage !== -1 && indexOfTempMessage === currentMessages[wsMsg.direct_id].length - 1) {
            return { ...currentMessages, [wsMsg.direct_id]: [...currentMessages[wsMsg.direct_id].map((msg) => (msg.catch_slug === wsMsg.catch_slug ? wsMsg : msg))] };
          } else if (indexOfTempMessage !== -1) {
            return { ...currentMessages, [wsMsg.direct_id]: [...currentMessages[wsMsg.direct_id].slice(0, indexOfTempMessage), ...currentMessages[wsMsg.direct_id].slice(indexOfTempMessage + 1), wsMsg] };
          }
        }

        return currentMessages;
      });
    }
  }, [directId, lastJsonMessage]);

  return <chatContext.Provider value={{ readMessage, setDirectFavorite, isFavorite, setIsFavorite, sendMessage, directs, messages, campaignId, directId, fetchNextDirects, fetchNextMessages, currentDirect }}>{children}</chatContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const context = useContext(chatContext);

  if (!context) throw new Error('Отсутствует провайдер ChatProvider');
  return context;
}

import { useEffect, useRef, useMemo, useState } from "react";
import ChatHeader from "./ChatHeader";
import { UseChatStore } from "../../store/UseChatStore";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaeholder";
import { useAuthStore } from "../../store/useAuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageInput from "./MessageInput";
import { MoreVerticalIcon, Reply } from "lucide-react";

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    isMessageLoading,
    subscribeToMessages,
    unsubscribeToMessages,
    isTyping,
    typingUsers,
    deleteMessage,
    setTextReply,
    setRelyToMessage,
  } = UseChatStore();

  const [hoveredToMessage, setHoveredToMessage] = useState(null);
  const [messageSelected, setMessageSelected] = useState(null);

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?.id || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    if (lastMsg.sender_id === selectedUser.id && !lastMsg.is_seen) {
      socket.emit("markMessagesAsSeen", {
        messagesender_id: selectedUser.id,
        myId: authUser.id,
        lastSeenMessageId: lastMsg.id,
      });
    }
  }, [messages, selectedUser, socket, authUser]);

  useEffect(() => {
    subscribeToMessages();

    // cleanUp
    return () => unsubscribeToMessages();
  }, [subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // CHECKING CLICK OUTSIDE SELECTED BODIES

  const SelectionDot = useRef(null);
  const SelectedList = useRef(null);

  const handleClickOutSide = (event) => {
    const path = event.composedPath();

    if (
      !path.includes(SelectionDot.current) &&
      !path.includes(SelectedList.current)
    ) {
      setMessageSelected(null);
      setHoveredToMessage(null);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClickOutSide);
    return () => {
      document.body.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  const msgSentTime = (msg) => {
    return new Date(msg).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const lastSentMessageId = useMemo(() => {
    return [...messages].reverse().find((m) => m.sender_id === authUser.id)?.id;
  }, [messages, authUser.id]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <ChatHeader />
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.length > 0 && !isMessageLoading ? (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`relative ${
                  messageSelected === msg.id ? "z-50" : "z-0"
                }`}
                onMouseEnter={() =>
                  !messageSelected && setHoveredToMessage(msg.id)
                }
                onMouseLeave={() =>
                  !messageSelected && setHoveredToMessage(null)
                }
              >
                <div
                  className={`chat z-10 ${
                    msg.sender_id === authUser.id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble relative rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 max-w-[85%] sm:max-w-[70%] wrap-break-word transition-all duration-300 ease-out
                ${
                  msg.sender_id === authUser.id
                    ? `bg-blue-900 text-white rounded-br-none ${
                        msg.isOptimistic
                          ? "-translate-x-3 opacity-80"
                          : "translate-x-0"
                      }`
                    : "bg-[#2f2f30d0] text-slate-200 rounded-bl-none"
                }
              `}
                  >
                    {/* Image */}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-lg mt-1.5 max-h-60 sm:max-h-72 w-full object-cover"
                      />
                    )}
                    {msg.text && (
                      <p className="mt-1 text-sm sm:text-base leading-relaxed">
                        {msg.text}
                      </p>
                    )}
                    <p className="text-[10px] sm:text-xs mt-1 opacity-70 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* --------------------------------------------------
                    HOVER CONTROLS 
                    PURPOSE: Show 3-dot action menu on hover 
                    TRIGGER: hoveredToMessage === msg.id
                    -------------------------------------------------- */}
                    {hoveredToMessage === msg.id && (
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 ${msg.sender_id === authUser.id ? "-left-8" : "-right-8"} cursor-pointer hover:bg-white/10 rounded-full p-1.5 transition`}
                        onClick={() => {
                          setMessageSelected(msg.id);
                          setHoveredToMessage(msg.id);
                        }}
                        ref={SelectionDot}
                      >
                        <MoreVerticalIcon size={18} />
                      </div>
                    )}

                    {/* -------------------------------------------------- 
                    CONTEXT MENU
                    actions: - Reply - Delete (only for message owner) 
                    Visible when: messageSelected === msg.id
                    -------------------------------------------------- */}
                    {messageSelected === msg.id && (
                      <div
                        ref={SelectedList}
                        className={`absolute top-12 
                        ${msg.sender_id === authUser.id ? "-left-44" : "-right-44"} 
                        bg-zinc-900 border border-white/10 rounded-xl shadow-xl 
                        min-w-40 max-w-50 overflow-hidden z-50`}
                      >
                        {/* Reply */}
                        <button
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition"
                          onClick={() => {
                            (setRelyToMessage(msg.text), setTextReply(true));
                          }}
                        >
                          <Reply size={18} />
                          <span>Reply</span>
                        </button>

                        {/* ------ Delete ------ */}
                        {msg.sender_id === authUser.id && (
                          <button
                            onClick={() => {
                              deleteMessage(msg.id, selectedUser.id);
                              setMessageSelected(null);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                          >
                            <img className="h-4 w-4" src="/close.svg" />
                            <span>Delete message</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* -------------------------------------------------- 
                    SEEN OR SENT STATUS                
                    actions: - If message seen by reciever will 
                               mark it seen else sent timing. 
                    -------------------------------------------------- */}
                {msg.id === lastSentMessageId && (
                  <p className="text-gray-500 text-sm text-right">
                    {msg.is_seen
                      ? "Seen"
                      : `Sent at ${msgSentTime(msg.created_at)}`}
                  </p>
                )}
              </div>
            ))}

            {/* 2. TYPING INDICATOR  */}
            {typingUsers[selectedUser?.id] && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-gray-800 text-xs italic opacity-50 flex items-center gap-1 rounded-2xl rounded-bl-none px-5 py-3">
                  <span className="loading loading-dots loading-xs"></span>
                </div>
              </div>
            )}

            {/* 3. SCROLL ANCHOR */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessageLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.full_name} />
        )}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;

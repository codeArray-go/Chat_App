import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import { UseChatStore } from "../store/UseChatStore";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaeholder";
import { useAuthStore } from "../store/useAuthStore";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    getMessageByUserId,
    isMessageLoading,
    subscribeToMessages,
    unsubsctibeToMessages,
  } = UseChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessageByUserId(selectedUser._id);
    subscribeToMessages();

    // cleanUp
    return () => unsubsctibeToMessages();
  }, [
    selectedUser,
    getMessageByUserId,
    subscribeToMessages,
    unsubsctibeToMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
        {messages.length > 0 && !isMessageLoading ? (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`
                chat-bubble relative rounded-2xl
                px-3 py-2 sm:px-4 sm:py-2.5
                max-w-[85%] sm:max-w-[70%]
                wrap-break-word
                ${
                  msg.senderId === authUser._id
                    ? "bg-cyan-600 text-white rounded-br-none"
                    : "bg-slate-800 text-slate-200 rounded-bl-none"
                }
              `}
                >
                  {/* Image */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="
                    rounded-lg mt-1.5
                    max-h-60 sm:max-h-72
                    w-full object-cover
                  "
                    />
                  )}

                  {/* Text */}
                  {msg.text && (
                    <p className="mt-1 text-sm sm:text-base leading-relaxed">
                      {msg.text}
                    </p>
                  )}

                  {/* Time */}
                  <p className="text-[10px] sm:text-xs mt-1 opacity-70 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessageLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;

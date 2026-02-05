import { useEffect } from "react";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UseChatStore } from "../store/UseChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatsList = () => {
  const {
    getMyChatPartners,
    chats,
    setSelectedUser,
    isUserLoading,
    selectedUser,
    typingUsers,
  } = UseChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUserLoading) return <UsersLoadingSkeleton />;
  if (chats.length == 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`tap-effect flex items-center justify-between gap-3 p-3 cursor-pointer transition-all rounded-xl  border 
            ${
              selectedUser?._id === chat._id
                ? "bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]"
                : "bg-transparent border-slate-800/65 hover:bg-slate-800/70"
            }
          `}
          onClick={() => setSelectedUser(chat)}
        >
          {" "}
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(chat._id) ? "avatar-online" : "avatar-offline"}`}
            >
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h4 className="text-slate-200 font-medium truncate">
                {chat.fullName}
              </h4>
              {typingUsers[chat._id] && (
                <p className="text-cyan-400 text-sm">typing...</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;

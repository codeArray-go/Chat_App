import { useEffect } from "react";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "../UserListSection/UsersLoadingSkeleton";
import { UseChatStore } from "../../store/UseChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const ChatsList = () => {
  const {
    getMyChatPartners,
    chats,
    setSelectedUser,
    isUserLoading,
    selectedUser,
    typingUsers,
    notifications,
    setIsSelectedUserFromList,
  } = UseChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUserLoading) return <UsersLoadingSkeleton />;
  if (chats.length == 0) return <NoChatsFound />;

  return (
    <>
      <h1 className="font-bold mb-2 mx-3 text-base">Chat List</h1>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`tap-effect rounded-lg flex items-center justify-between gap-3 p-2.5 cursor-pointer transition-all 
            ${
              selectedUser?.id === chat.id
                ? "bg-[#18181b]"
                : "bg-transparent hover:bg-[#0d1117]"
            }
          `}
          onClick={() => {
            setSelectedUser(chat);
            setIsSelectedUserFromList(true);
          }}
        >
          {" "}
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(chat.id) ? "avatar-online" : "avatar-offline"}`}
            >
              <div className="size-14 rounded-full overflow-hidden">
                <img
                  src={chat.profile_pic || "/avatar.png"}
                  alt={chat.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h4 className="text-slate-200 text-[15px] font-medium truncate">
                {chat.full_name}
              </h4>
              {typingUsers[chat.id] && (
                <p className="text-cyan-400 text-sm">typing...</p>
              )}
            </div>
          </div>
          {notifications[chat.id] > 0 && (
            <div className="rounded-full border border-green-400 text-xs text-green-500 font-medium px-2 py-0.5">
              {notifications[chat.id]}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ChatsList;

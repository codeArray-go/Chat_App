import { XIcon } from "lucide-react";
import { UseChatStore } from "../../store/UseChatStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router";

function ChatHeader() {
  const {
    selectedUser,
    setSelectedUser,
    typingUsers,
    setIsSelectedUserFromList,
  } = UseChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser.id);
  const closeRef = useRef(null);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  const navigateTo = useNavigate();

  return (
    <div className="flex sm:relative justify-between items-center bg-[#06070ae7] max-h-21 px-6 flex-1 cursor-pointer shrink-0">
      <div className="flex items-center space-x-3">
        <div
          className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}
        >
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profile_pic || "/avatar.png"}
              alt={selectedUser.full_name}
            />
          </div>
        </div>

        <div>
          <h3
            className="text-slate-200 font-medium"
            onClick={() => navigateTo("/Dashboard")}
          >
            {selectedUser.full_name}
          </h3>
          <p className="text-slate-400 text-sm">
            {isOnline
              ? `${typingUsers[selectedUser.id] ? "typing..." : "online"}`
              : "Offline"}
          </p>
        </div>
      </div>

      <button
        className="hover:bg-[rgba(255,255,255,0.08)] rounded-full p-2.5"
        onClick={() => {
          setSelectedUser(null);
          setIsSelectedUserFromList(false);
        }}
      >
        <XIcon
          ref={closeRef}
          className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        />
      </button>
    </div>
  );
}
export default ChatHeader;

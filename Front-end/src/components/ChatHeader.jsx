import { XIcon } from "lucide-react";
import { UseChatStore } from "../store/UseChatStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, typingUsers } = UseChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const closeRef = useRef(null);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-900/30 border-b
   border-slate-800/40 max-h-21 px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div
          className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}
        >
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-sm">
            {isOnline
              ? `${typingUsers[selectedUser._id] ? "typing..." : "online"}`
              : "Offline"}
          </p>
        </div>
      </div>

      <button
        className="hover:bg-[rgba(255,255,255,0.08)] rounded-full p-2.5"
        onClick={() => setSelectedUser(null)}
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

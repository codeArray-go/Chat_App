import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { UseChatStore } from "../store/UseChatStore";

const ChatPage = () => {
  const { activeTab, selectedUser } = UseChatStore();

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* LEFT PANEL */}
      <div
        className={`
      bg-slate-800/50 backdrop-blur-sm flex flex-col border-r border-gray-800
      w-full sm:w-80
      ${selectedUser ? "hidden sm:flex" : "flex"}
    `}
      >
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`
      bg-slate-900/50 backdrop-blur-sm flex-1 flex flex-col
      w-full
      ${selectedUser ? "flex" : "hidden sm:flex"}
    `}
      >
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
};

export default ChatPage;

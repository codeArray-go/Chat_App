import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { UseChatStore } from "../store/UseChatStore";
import NavigationBar from "../components/NavigationBar";
import SideSearchBar from "../components/SideSearchBar";

const ChatPage = () => {
  const { activeTab, selectedUser } = UseChatStore();

  return (
    <div className="relative w-screen h-screen flex overflow-hidden z-10">

      <SideSearchBar />

      {/* NAVIGATION PANEL */}
      <div className="bg-[#06070ae7] border-r border-[#20202080] h-screen w-14 backdrop-blur-xl">
        <NavigationBar />
      </div>

      {/* LEFT PANEL */}
      <div
        className={`bg-[#06070ae7] backdrop-blur-xl flex flex-col w-full sm:w-80 absolute sm:relative inset-0 z-20 transition-transform duration-300 ease-in-out
        ${selectedUser ? "-translate-x-full sm:translate-x-0 hidden sm:flex" : "translate-x-0 flex"}
        `}
      >
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`bg-[#0d1117] flex-1 flex flex-col absolute sm:relative inset-0 z-10 transition-transform duration-300 ease-in-out ${selectedUser ? "translate-x-0 flex" : "translate-x-full sm:translate-x-0 hidden sm:flex"} `}
      >
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
};

export default ChatPage;

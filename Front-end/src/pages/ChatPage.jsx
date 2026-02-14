import ChatsList from "../components/UserListSection/ChatsList";
import ChatContainer from "../components/chatSection/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { UseChatStore } from "../store/UseChatStore";
import NavigationBar from "../components/sideBar/NavigationBar";
import SideBar from "../components/sideBar/SideBar";
import ProfileHeader from "../components/UserListSection/ProfileHeader";
import ActiveSeachInChat from "../components/sideBar/ActiveSeachInChat"

const ChatPage = () => {
  const { selectedUser, isSelectedUserFromList } = UseChatStore();

  return (
    <div className="relative w-screen h-screen flex overflow-hidden z-10">

      <SideBar />

      {/* NAVIGATION PANEL */}
      <NavigationBar />

      {/* LEFT PANEL */}
      <div
        className={`bg-[#06070ae7] backdrop-blur-xl flex flex-col w-full sm:w-80 absolute sm:relative inset-0 z-20 transition-transform duration-300 ease-in-out
        ${selectedUser ? "-translate-x-full sm:translate-x-0 hidden sm:flex" : "translate-x-0 flex"}
        `}
      >
        <ProfileHeader />
        <ActiveSeachInChat />

        <div className="flex-1 overflow-y-auto py-3 px-1.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <ChatsList />
        </div>
      </div>


      {/* RIGHT PANEL */}
      <div
        className={`bg-[#0d1117] flex-1 flex flex-col absolute sm:relative inset-0 z-10 transition-transform duration-300 ease-in-out ${selectedUser ? "translate-x-0 flex" : "translate-x-full sm:translate-x-0 hidden sm:flex"} `}
      >
        {isSelectedUserFromList ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>

    </div>
  );
};

export default ChatPage;

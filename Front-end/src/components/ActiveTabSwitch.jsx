import { UseChatStore } from "../store/UseChatStore";

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = UseChatStore();

  return (
    <div className="tabs tabs-box bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${activeTab === "chats"
            ? "bg-[#18181b] text-white"
            : "text-slate-400"
          }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${activeTab === "contacts"
            ? "bg-[#18181b] text-white"
            : "text-slate-400"
          }`}
      >
        Contacts
      </button>
    </div>
  );
};
export default ActiveTabSwitch;

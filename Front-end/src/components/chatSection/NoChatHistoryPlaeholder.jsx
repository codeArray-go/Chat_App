import { MessageCircleIcon } from "lucide-react";
import { UseChatStore } from "../../store/UseChatStore";

const NoChatHistoryPlaceholder = ({ name }) => {

  const { setText } = UseChatStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-20 bg-[#06070ae7] rounded-full flex items-center justify-center mb-6">
        <MessageCircleIcon className="size-10" />
      </div>
      <h3 className="text-lg font-medium text-slate-200 mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-slate-400 text-sm">
          This is the beginning of your conversation. Send a message to start
          chatting!
        </p>
        <div className="h-px w-32 bg-linear-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setText("👋 Hello")}
          className="px-4 py-2 text-xs font-medium text-white bg-[#161a20] rounded-full hover:bg-gray-400/15 transition-colors">
          👋 Say Hello
        </button>
        <button
          onClick={() => setText("🤝 How are you?")}
          className="px-4 py-2 text-xs font-medium text-white bg-[#161a20] rounded-full hover:bg-gray-400/15 transition-colors">
          🤝 How are you?
        </button>
        <button
          onClick={() => setText("📅 Meet up soon?")}
          className="px-4 py-2 text-xs font-medium text-white bg-[#161a20] rounded-full hover:bg-gray-400/15 transition-colors">
          📅 Meet up soon?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;

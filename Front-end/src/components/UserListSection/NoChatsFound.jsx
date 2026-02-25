import { MessageCircleIcon } from "lucide-react";
import { UseChatStore } from "../../store/UseChatStore";

function NoChatsFound() {

  const { setSearchBarOpen } = UseChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="size-20 bg-[#0d1117] rounded-full flex items-center justify-center mb-6">
        <MessageCircleIcon className="size-10" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">
          No conversations yet
        </h4>
        <p className="text-slate-400 text-sm px-6">
          Start a new chat by searching your contacts.
        </p>
      </div>
      <button
        onClick={() => setSearchBarOpen(true)}
        className="text-sm text-white btn bg-[#161a20] rounded-lg"
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;

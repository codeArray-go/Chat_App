import { Search, XIcon } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore";
import { UseChatStore } from "../store/UseChatStore";

const SideSearchBar = () => {

  const { onlineUsers } = useAuthStore();
  const { searchedUser, searchInContacts, setSelectedUser, selectedUser, sideBarOpen, setSideBarOpen } = UseChatStore();

  const debounce = (fn, delay) => {
    let timeId;
    return (...args) => {
      clearTimeout(timeId);
      timeId = setTimeout(() => fn(...args), delay);
    };
  };

  const searchWithDebounce = debounce((value) => {
    searchInContacts({ query: value });
  }, 500);

  return (
    <>
      {/* SIDEBAR  */}
      <div className={`transition ${sideBarOpen ? "translate-x-0" : "-translate-x-[100%]"} duration-500 w-screen sm:max-w-[23.5rem] h-screen bg-black absolute top-0 left-0 z-50 p-10`}>
        <XIcon size={25} className="absolute right-5 top-5 cursor-pointer hover:bg-[rgba(255,255,255,0.2)] rounded-full p-1 h-8 w-8"
          onClick={() => setSideBarOpen(false)} />
        <h2 className="mb-5 text-2xl font-bold">Search</h2>
        <label className="w-full flex items-center justify-center relative">
          <input onInput={(e) => searchWithDebounce(e.target.value)} type="search" className="w-full h-10 border-gray-600/20 bg-[rgba(255,255,255,0.1)] border rounded-full p-4 outline-none" placeholder="Search with username" />
          <Search size={24} className="text-gray-400 cursor-pointer absolute top-2 right-2" />
        </label>
        {searchedUser.map((searchResult) => {
          return (
            <div
              key={searchResult._id}
              className={`tap-effect flex items-center justify-between mt-4 gap-3 p-3 cursor-pointer transition-all 
            ${selectedUser?._id === searchResult._id
                  ? "bg-[#18181b]" : "bg-transparent hover:bg-[#0d1117]"
                }
          `}
              onClick={() => setSelectedUser(searchResult)}
            >
              {" "}
              <div className="flex items-center gap-3">
                <div
                  className={`avatar ${onlineUsers.includes(searchResult._id) ? "avatar-online" : "avatar-offline"}`}
                >
                  <div className="size-10 rounded-full overflow-hidden">
                    <img
                      src={searchResult.profilePic || "/avatar.png"}
                      alt={searchResult.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-slate-200 text-base font-medium truncate">
                    {searchResult.fullName}
                  </h4>

                </div>
              </div>
            </div>
          )
        })}

      </div>
    </>

  )
}

export default SideSearchBar

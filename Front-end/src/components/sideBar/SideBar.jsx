import { Search, XIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { UseChatStore } from "../../store/UseChatStore";
import { useNavigate } from "react-router";

const SideBar = () => {
  const { onlineUsers } = useAuthStore();
  const {
    searchedUser,
    searchInContacts,
    selectedUser,
    searchBarOpen,
    setSearchBarOpen,
    setNotificationCenteOpen,
    notificationCenterOpen,
    setSelectedUser,
    clearSearchedUser,
  } = UseChatStore();

  const navigateTo = useNavigate();

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

  const isSideBarCalled = searchBarOpen || notificationCenterOpen;

  return (
    <div
      className={`transition-transform ${isSideBarCalled ? "translate-x-0" : "-translate-x-full"} duration-500 w-screen sm:max-w-94 h-screen bg-black absolute top-0 left-0 z-50 p-10`}
    >
      <XIcon
        size={25}
        className="absolute right-5 top-5 cursor-pointer hover:bg-[rgba(255,255,255,0.2)] rounded-full p-1 h-8 w-8"
        onClick={() => {
          setSearchBarOpen(false);
          setNotificationCenteOpen(false);
          clearSearchedUser();
        }}
      />

      {searchBarOpen && (
        <>
          {/* SEARCH BOX */}
          <h2 className="mb-5 text-2xl font-bold">Search</h2>
          <label className="w-full flex items-center justify-center relative">
            <input
              onInput={(e) => searchWithDebounce(e.target.value)}
              type="search"
              className="w-full h-10 border-gray-600/20 bg-[rgba(255,255,255,0.1)] border rounded-full p-4 outline-none"
              placeholder="Search with username"
            />
            <Search
              size={24}
              className="text-gray-400 cursor-pointer absolute top-2 right-2"
            />
          </label>
          {searchedUser.map((searchResult) => {
            return (
              <div
                key={searchResult._id}
                className={`tap-effect rounded-lg flex items-center justify-between mt-4 gap-3 p-2.5 cursor-pointer transition-all 
                           ${selectedUser?._id === searchResult._id ? "bg-[#18181b]" : "bg-transparent hover:bg-[#0d1117]"}`}
                onClick={() => {
                  setSelectedUser(searchResult);
                  navigateTo("/Dashboard");
                  setSearchBarOpen(false);
                  clearSearchedUser();
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`avatar ${onlineUsers.includes(searchResult._id) ? "avatar-online" : "avatar-offline"}`}
                  >
                    <div className="size-10 rounded-full overflow-hidden">
                      <img
                        src={searchResult.profile_pic || "/avatar.png"}
                        alt={searchResult.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-slate-200 text-base font-medium truncate">
                      {searchResult.full_name}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {notificationCenterOpen && (
        <>
          <h1 className="font-bold text-base my-7">Notification Center</h1>

          <div className="h-full w-full flex flex-col gap-3 items-center py-28">
            <h1 className="font-bold text-xl text-gray-500 text-center">
              Feature under development till then enjoy chatting with friends
            </h1>
            <button
              onClick={() => {
                navigateTo("/");
                setNotificationCenteOpen(false);
              }}
              className="text-sm text-white btn btn-primary rounded-lg"
            >
              Enjoy chatting
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;

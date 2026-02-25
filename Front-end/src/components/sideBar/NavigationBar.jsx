import {
  Settings,
  Search,
  Heart,
  MessageCircleIcon,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { UseChatStore } from "../../store/UseChatStore";
import { useLocation, useNavigate } from "react-router";

const NavigationBar = () => {
  const { authUser } = useAuthStore();
  const { setSearchBarOpen, setNotificationCenteOpen } = UseChatStore();
  const navigateTo = useNavigate();
  const location = useLocation();

  const isMessageActive = location.pathname === "/";
  const isHomeActive = location.pathname === "/Home";

  return (
    <div
      className="fixed bottom-3 left-3 right-3 z-50 flex flex-row justify-center sm:rounded-none rounded-xl bg-[#1b1b1ce7] h-12 
                sm:bottom-0 sm:right-0 sm:left-auto sm:relative sm:flex sm:flex-col items-center sm:justify-between 
                sm:bg-[#06070ae7] sm:h-screen sm:w-12 border-t sm:border-t-0 sm:border-l border-gray-500/10 backdrop-blur-xl"
    >
      {/* TOP SECTION (PC) / LEFT SECTION (MOBILE) */}
      <div className="flex flex-row sm:flex-col items-center w-full">
        {/* Logo - Hidden on mobile to save space, shown on PC */}
        <div className="hidden sm:flex py-7 justify-center mb-5 w-full">
          <p className="font-bold text-lg">&lt;&#8725;&gt;</p>
        </div>

        <div className="flex flex-row sm:flex-col items-center justify-around sm:justify-start w-full py-2 sm:py-4 gap-4 sm:gap-8">
          <Search
            size={24}
            className="cursor-pointer"
            onClick={() => setSearchBarOpen(true)}
          />

          <MessageCircleIcon
            size={24}
            className="transition text-white cursor-pointer"
            fill={isMessageActive ? "currentColor" : "none"}
            stroke={isMessageActive ? "none" : "currentColor"}
            onClick={() => navigateTo("/")}
          />

          <Heart
            size={24}
            className="cursor-pointer transition text-white"
            onClick={() => setNotificationCenteOpen(true)}
          />

          <img
            src="./More.svg"
            className="h-7 w-7 cursor-pointer"
            alt="More Projects"
            onClick={() => window.open("https://all-links-f.vercel.app/Cafane")}
          />
        </div>
      </div>

      {/* BOTTOM SECTION (PC) / RIGHT SECTION (MOBILE) */}
      <div className="flex flex-row sm:flex-col gap-4 sm:gap-6 items-center px-4 sm:px-0 sm:py-4 sm:border-t border-[#2f2f30d0]">
        <Settings
          size={24}
          className="transition-transform duration-700 hover:rotate-90 cursor-pointer"
        />

        {authUser && (
          <div
            onClick={() => navigateTo("/Dashboard")}
            className="rounded-full overflow-hidden h-8 w-8 sm:h-9 sm:w-9 border-2 border-[#6b6b6b] cursor-pointer shrink-0"
          >
            <img
              src={authUser.profilePic || "./avatar.png"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;

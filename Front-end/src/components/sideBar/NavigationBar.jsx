import { Settings, Home, Search, PersonStandingIcon, Heart, MessageCircleIcon } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore";
import { UseChatStore } from "../../store/UseChatStore";
import { useLocation, useNavigate } from "react-router";

const NavigationBar = () => {
    const { authUser } = useAuthStore();
    const { setSearchBarOpen, setNotificationCenteOpen } = UseChatStore();
    const navigateTo = useNavigate();
    const location = useLocation();

    const isMessageActive = location.pathname === '/';
    const isHomeActive = location.pathname === '/Home';

    return (
        <div className='flex flex-col items-center justify-between relative bg-[#06070ae7] h-screen w-12 border-r border-gray-500/10 backdrop-blur-xl'>

            {/* UPPER HALF */}
            <div className="w-full">
                {/* Logo */}
                <div className="py-7 flex justify-center mb-5">
                    <p className="font-bold text-lg">&lt;&#8725;&gt;</p>
                </div>
                <div className="flex flex-col items-center py-4 gap-8">
                    <Home
                        className="text-white cursor-pointer transition"
                        fill={isHomeActive ? "currentColor" : "none"}
                        stroke={isHomeActive ? "none" : "currentColor"}
                        onClick={() => navigateTo("/Home")}
                        size={24}
                    />

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
                        onClick={() => {
                            navigateTo('/')
                        }}
                    />

                    <Heart
                        size={24}
                        className="cursor-pointer transition text-white"
                        onClick={() => setNotificationCenteOpen(true)}
                    />

                    <PersonStandingIcon size={25} />
                </div>
            </div>

            {/* LOWER HALF */}
            <div className="flex flex-col gap-6 items-center border-t border-[#2f2f30d0] py-4">
                <Settings
                    size={24}
                    className="transition-transform duration-700 hover:rotate-90 cursor-pointer"
                />

                {authUser && (
                    <div
                        onClick={() => navigateTo("/Dashboard")}
                        className="rounded-full overflow-hidden h-9 w-9 border-2 border-[#6b6b6b] cursor-pointer"
                    >
                        <img src={`${authUser.profilePic}`} />
                    </div>
                )
                }

            </div>
        </div >
    )
}

export default NavigationBar

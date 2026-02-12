import { Settings, Home, Search, MessageCircleDashed, PersonStandingIcon } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore";
import { UseChatStore } from "../store/UseChatStore";

const NavigationBar = () => {
    const { authUser } = useAuthStore();
    const { setSideBarOpen } = UseChatStore();

    return (
        <div className='flex flex-col items-center justify-between h-full w-full relative'>

            {/* UPPER HALF */}
            <div className="w-full">
                {/* Logo */}
                <div className="border-b border-[#2f2f30d0] py-7 flex justify-center">
                    <p>Chween</p>
                </div>
                <div className="flex flex-col items-center py-4 gap-8">
                    <a href="/Home"><Home size={30} /></a>
                    <Search size={30} className="cursor-pointer" onClick={() => setSideBarOpen(true)} />
                    <a href="/" className="cursor-pointer"><MessageCircleDashed size={30} /></a>
                    <PersonStandingIcon size={30} />
                </div>

            </div>

            {/* LOWER HALF */}
            <div className="flex flex-col gap-6 items-center border-t border-[#2f2f30d0] py-4">
                <Settings
                    size={24}
                    className="transition-transform duration-700 hover:rotate-90 cursor-pointer"
                />

                {authUser && (
                    <a href="/Dashboard" className="rounded-full overflow-hidden h-9 w-9 border-2 border-[#6b6b6b]">
                        <img src={`${authUser.profilePic}`} />
                    </a>
                )
                }

            </div>
        </div>
    )
}

export default NavigationBar

import NavigationBar from '../components/sideBar/NavigationBar'
import { useAuthStore } from '../store/useAuthStore'
import { UseChatStore } from '../store/UseChatStore'

const Dashboard = () => {
    const { authUser } = useAuthStore()
    const { selectedUser } = UseChatStore()

    return (
        <div className='flex justify-between w-screen h-screen'>
            <NavigationBar />
            <div className='bg-[#0d1117] h-full w-full p-20'>
                <div>
                    <div className='flex gap-5 justify-center items-center'>
                        {/* ProfilePic */}
                        <div className='h-32 w-32 border-2 border-slate-300 rounded-full overflow-hidden'>
                            <img src={(selectedUser ? selectedUser.profilePic : authUser.profilePic) || "/avatar.png"} alt="userProfilePic" className='rounded-full object-center' />
                        </div>

                        {/* Other detail */}
                        <div>
                            <p className='font-bold text-xl'>{selectedUser ? selectedUser.fullName : authUser.fullName}</p>
                        </div>

                    </div>

                    <div className="button flex gap-5 justify-center mt-10">
                        <button className='btn btn-wide py-6 rounded-xl'>{selectedUser ? "Follow" : "Edit Profile"}</button>
                        <button className='btn btn-wide py-6 rounded-xl'>{selectedUser ? "Message" : "View"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

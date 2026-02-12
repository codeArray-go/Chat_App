import NavigationBar from '../components/NavigationBar'
import { useAuthStore } from '../store/useAuthStore'

const Dashboard = () => {
    const { authUser } = useAuthStore()

    return (
        <div className='flex justify-between w-screen h-screen'>
            <div className="bg-[#06070ae7] border-r border-[#20202080] h-screen w-14 backdrop-blur-xl">
                <NavigationBar />
            </div>
            <div className='bg-[#0d1117] h-full w-[calc(100vw-3.5rem)] p-20'>
                <div>
                    <div className='flex gap-5 justify-center items-center'>
                        {/* ProfilePic */}
                        <div className='h-32 w-32 border-2 border-slate-300 rounded-full overflow-hidden'>
                            <img src={authUser.profilePic} alt="userProfilePic" className='rounded-full object-center' />
                        </div>

                        {/* Other detail */}
                        <div>
                            <p className='font-bold text-xl'>{authUser.fullName}</p>
                        </div>

                    </div>

                    <div className="button flex gap-5 justify-center mt-10">
                        <button className='btn btn-wide py-6 rounded-xl'>Edit Profile</button>
                        <button className='btn btn-wide py-6 rounded-xl'>View Posts</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
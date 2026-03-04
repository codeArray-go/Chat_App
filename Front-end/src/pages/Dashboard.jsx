import { useNavigate } from "react-router";
import NavigationBar from "../components/sideBar/NavigationBar";
import { useAuthStore } from "../store/useAuthStore";
import { UseChatStore } from "../store/UseChatStore";

const Dashboard = () => {
  const { authUser } = useAuthStore();
  const { selectedUser, setIsSelectedUserFromList, sendFriendRequest } =
    UseChatStore();
  const navigateTo = useNavigate();

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#0d1117]">
      {/* Navigation - Assuming it handles its own mobile responsiveness */}
      <NavigationBar />

      <div className="flex-1 p-6 md:p-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Section */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center text-center sm:text-left">
            {/* ProfilePic - Fixed size with responsive adjustment if needed */}
            <div className="h-32 w-32 border-2 border-slate-300 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={
                  (selectedUser
                    ? selectedUser.profilePic
                    : authUser.profilePic) || "/avatar.png"
                }
                alt="userProfilePic"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Other detail */}
            <div className="flex flex-col">
              <h1 className="font-bold text-2xl text-white">
                {selectedUser ? selectedUser.fullName : authUser.fullName}
              </h1>
              {/* Add bio or stats here later */}
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 px-4 sm:px-0">
            <button
              onClick={() => selectedUser && sendFriendRequest()}
              className="btn btn-primary sm:btn-wide py-4 h-auto rounded-xl"
            >
              {selectedUser ? "Follow" : "Edit Profile"}
            </button>

            <button
              onClick={() => {
                setIsSelectedUserFromList(true);
                navigateTo("/");
              }}
              className="btn btn-outline sm:btn-wide py-4 h-auto rounded-xl text-white"
            >
              {selectedUser ? "Message" : "View"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

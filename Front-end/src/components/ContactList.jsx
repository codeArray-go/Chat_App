import { useEffect } from "react";
import { UseChatStore } from "../store/UseChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContact, setSelectedUser, isUsersLoading, selectedUser } =
    UseChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContact.map((contact) => (
        <div
          key={contact._id}
          className={`tap-effect flex items-center gap-3 p-3 cursor-pointer transition-all rounded-xl  border 
            ${
              selectedUser?._id === contact._id
                ? "bg-cyan-500/15 border-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]"
                : "bg-transparent border-slate-800/65 hover:bg-slate-800/70"
            }
          `}
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(contact._id) ? "avatar-online" : "avatar-offline"}`}
            >
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={`${contact.fullName || "User"} avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;

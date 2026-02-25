import { useState, useRef } from "react";
import { LogOutIcon, EllipsisVertical, XIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore"

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    /* ---------- VALIDATING FILE TYPE ---------- */
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    /* ---------- VALIDATING FILE SIZE (2MB limit) ---------- */
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        setSelectedImg(base64Image);

        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        toast.error("Failed to upload image");
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="p-6 border-b border-gray-500/15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar border-2 border-gray-200/50 rounded-full">
            <button
              className="size-14 rounded-full overflow-hidden relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME */}
          <div>
            <h3 className="text-slate-200 font-semibold text-base max-w-45 truncate">
              {authUser.fullName}
            </h3>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center relative">
          {/* LOGOUT BTN */}
          <div onClick={() => { setOpenMenu((prev) => !prev) }} className=" p-2 hover:bg-[rgba(255,255,255,0.2)] rounded-full cursor-pointer">
            {!openMenu ? <EllipsisVertical size={20} /> : <XIcon size={20} />}
          </div>

          {openMenu &&

            <div
              className="absolute z-10 top-12 right-2 sm:right-0 min-w-44 bg-[#101013] border border-[#444444] rounded-xl shadow-2xl shadow-black/60 p-1.5 text-slate-300 ring-1 ring-white/5 backdrop-blur-sm"
            >
              <button
                onClick={logout}
                className="group flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-[#2b2b2b] hover:text-white transition-all duration-200 text-sm font-medium"
              >
                Logout
                <LogOutIcon className="size-4 text-slate-500 transition-colors duration-200" />
              </button>

              <button
                type="button"
                className="mt-1 w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#2b2b2b] hover:text-white transition-all duration-200 text-sm font-medium"
              >
                Theme
              </button>
            </div>

          }

        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;

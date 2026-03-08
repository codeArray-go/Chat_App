import { useRef, useState } from "react";
import NavigationBar from "./sideBar/NavigationBar";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { XIcon } from "lucide-react";
import { UseChatStore } from "../store/UseChatStore";

const EditProfilePage = () => {
  const imageRef = useRef(null);

  const [imgPreview, setImgPreview] = useState();
  const { authUser, updateProfile } = useAuthStore();
  const { setEditProfile } = UseChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select a image file type.");
      return;
    }

    const MAX = 5 * 1024 * 1024;

    if (file.size > MAX) {
      toast.error("File size should be under 5 mb");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        setImgPreview(base64Image);
        await updateProfile({ profile_pic: base64Image });
      } catch (error) {
        toast.error("error uploading file.");
        console.log(error);
      }
    };

    reader.onerror = () => {
      toast.error("error while reading file.");
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-between">
      <NavigationBar />

      <XIcon
        size={30}
        className="fixed top-5 right-5 cursor-pointer"
        onClick={() => setEditProfile(false)}
      />

      <div className="w-full h-screen p-5">
        {/*----- Image ------*/}
        <div
          className="rounded-full h-40 w-40 overflow-hidden cursor-pointer"
          onClick={() => imageRef.current.click()}
        >
          <img
            src={imgPreview || authUser.profile_pic || "/avatar.png"}
            alt=""
          />
          <input
            accept="image/*"
            className="hidden"
            ref={imageRef}
            type="file"
            onChange={handleImageChange}
          />
        </div>

        <p className="font-bold text-xl mt-2">{authUser.full_name}</p>
      </div>
    </div>
  );
};

export default EditProfilePage;

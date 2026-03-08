import { useRef, useState } from "react";
import { UseChatStore } from "../../store/UseChatStore";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const MessageInput = () => {
  const { selectedUser, text, setText, setRelyToMessage, replyToMessage } =
    UseChatStore();
  const { socket } = useAuthStore();

  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = UseChatStore();
  const inputRef = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);

    /* ------ If user clears input completely, stop typing immediately ------ */
    if (e.target.value.trim() === "") {
      socket.emit("stopTyping", selectedUser.id);
      return;
    }
  };

  /* ------ Immediate stop if they click outside ------ */
  const handleBlur = () => {
    socket.emit("stopTyping", selectedUser.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imgPreview) return;

    socket.emit("stopTyping", selectedUser.id);

    try {
      /* ------ Cleanup ------ */
      setText("");
      if (replyToMessage) setRelyToMessage(null);
      setImgPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await sendMessage({
        text: text.trim(),
        image: imgPreview,
        reply_to: replyToMessage.text,
      });

      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /* ---------- Image upload button function ---------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImgPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImgPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = () => {
    socket.emit("typing", selectedUser.id);
  };

  return (
    <div className="border-t border-[#2f2f30d0] px-2 sm:px-4 py-2 bg-[#06070ae7] shrink-0">
      {/*------ Image Preview ------*/}
      {imgPreview && (
        <div className="max-w-3xl mx-auto mb-2 flex items-center">
          <div className="relative">
            <img
              src={imgPreview}
              alt="Preview"
              className="mt-2 max-h-28 sm:max-h-36 w-auto rounded-lg border border-slate-700 object-cover"
            />
            <button
              onClick={removeImage}
              type="button"
              className=" absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 flex items-center justify-centertext-slate-200 hover:bg-slate-700"
            >
              <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/*------ Text Reply ------*/}
      {replyToMessage && (
        <div className="max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto mb-2 flex justify-between p-2 sm:p-3 relative">
          <div className="pr-7 w-full">
            {replyToMessage.text && (
              <>
                <h2 className="text-xs sm:text-sm">
                  <span className="font-bold">Reply</span> to:
                </h2>

                <p className="text-gray-500 text-xs sm:text-sm mt-1 wrap-break-word leading-relaxed">
                  {replyToMessage.text}
                </p>
              </>
            )}

            {replyToMessage.image && (
              <img
                src={replyToMessage.image}
                alt="Preview"
                className="mt-2 max-h-28 sm:max-h-36 w-auto rounded-lg border border-slate-700 object-cover"
              />
            )}
          </div>

          <button
            onClick={() => setRelyToMessage(null)}
            type="button"
            className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 transition"
          >
            <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {/*------ Input Form ------*/}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-end gap-2 sm:gap-3"
      >
        {/*------ Text input ------*/}
        <input
          type="text"
          ref={inputRef}
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Type your message..."
          className="flex-1 bg-[#0d1117] border border-[#2f2f30d0] rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-[#686868]"
        />

        {/*------ Hidden File Input ------*/}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/*------ Image Button -----*/}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`shrink-0 bg-slate-800/50 rounded-lg p-2 transition-colors ${imgPreview ? "text-cyan-500" : "text-slate-400 hover:text-slate-200"}
      `}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/*------ Send Button ------*/}
        <button
          type="submit"
          disabled={!text.trim() && !imgPreview}
          className="shrink-0
        bg-[#0d1117] text-white rounded-lg p-2 sm:px-4 sm:py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

import { useRef, useState } from "react";
import { UseChatStore } from "../../store/UseChatStore";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const MessageInput = () => {
  const {
    selectedUser,
    text,
    setText,
    TextReply,
    setTextReply,
    setRelyToMessage,
    replyToMessage,
  } = UseChatStore();
  const { socket } = useAuthStore();

  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = UseChatStore();
  const inputRef = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);

    // If user clears input completely, stop typing immediately
    if (e.target.value.trim() === "") {
      socket.emit("stopTyping", selectedUser.id);
      return;
    }
  };

  // Immediate stop if they click outside
  const handleBlur = () => {
    socket.emit("stopTyping", selectedUser.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imgPreview) return;

    socket.emit("stopTyping", selectedUser.id);

    try {
      // Cleanup
      setText("");
      setImgPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await sendMessage({
        text: text.trim(),
        image: imgPreview,
      });

      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  /* ---------- IMAGE UPLOAD BUTTON FUNCTION ---------- */
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
    <div className="border-t border-[#2f2f30d0] px-2 sm:px-4 py-2 bg-[#06070ae7]">
      {/* Image preview */}
      {imgPreview && (
        <div className="max-w-3xl mx-auto mb-2 flex items-center">
          <div className="relative">
            <img
              src={imgPreview}
              alt="Preview"
              className="
            w-16 h-16 sm:w-20 sm:h-20
            object-cover rounded-lg
            border border-slate-700
          "
            />
            <button
              onClick={removeImage}
              type="button"
              className="
            absolute -top-2 -right-2
            w-5 h-5 sm:w-6 sm:h-6
            rounded-full bg-slate-800
            flex items-center justify-center
            text-slate-200 hover:bg-slate-700
          "
            >
              <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TEXT REPLY */}
      {TextReply && (
        <div className="max-w-3xl mx-auto mb-2 flex justify-between p-2 relative">
          <div>
            <p>{replyToMessage}</p>
            <img
              src={imgPreview}
              alt="Preview"
              className="
            w-16 h-16 sm:w-20 sm:h-20
            object-cover rounded-lg
            border border-slate-700
          "
            />
          </div>
          <button
            onClick={() => {
              (setTextReply(false), setRelyToMessage(null));
            }}
            type="button"
            className="
            absolute -top-2 -right-2
            w-5 h-5 sm:w-6 sm:h-6
            rounded-full bg-slate-800
            flex items-center justify-center
            text-slate-200 hover:bg-slate-700
          "
          >
            <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-end gap-2 sm:gap-3"
      >
        {/* Text input */}
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

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Image button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`
        shrink-0
        bg-slate-800/50
        rounded-lg
        p-2
        transition-colors
        ${imgPreview ? "text-cyan-500" : "text-slate-400 hover:text-slate-200"}
      `}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() && !imgPreview}
          className="
        shrink-0
        bg-[#0d1117]
        text-white
        rounded-lg
        p-2 sm:px-4 sm:py-2
        transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
      "
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const UseChatStore = create((set, get) => ({
  allContact: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isTyping: false,
  typingUserId: null,
  lastMessageIsSeen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),

  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContact: res.data });
    } catch (error) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessageByUserId: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tmpID = `tmp-${Date.now()}`;

    const optimisticMessage = {
      _id: tmpID,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tmpID ? res.data : msg,
        ),
      }));

      return selectedUser._id;
    } catch (error) {
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, typingUserId, isTyping, messageSenderId } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const currentUserMessages = get().messages;
      set({ messages: [...currentUserMessages, newMessage] });
    });

    socket.on("typing", (senderId) => {
      set({
        isTyping: true,
        typingUserId: senderId,
      });
    });

    socket.on("stopTyping", () => {
      set({ isTyping: false, typingUserId: null });
    });

    // 3. SEEN LISTENER (Fixed)
    socket.on("messagesSeenByPeer", (peerId) => {
      const { selectedUser, lastMessageIsSeen } = get();

      if (selectedUser && selectedUser._id === peerId) {
        set({ lastMessageIsSeen: true });
      }
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));

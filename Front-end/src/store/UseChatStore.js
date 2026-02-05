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
  typingUsers: {},

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
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
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
      isSeen: false,
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
    const { selectedUser } = get();

    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const currentUserMessages = get().messages;
      set({ messages: [...currentUserMessages, newMessage] });
    });

    socket.on("messagesSeenByPeer", (peerId) => {
      if (!peerId) return;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.receiverId === peerId ? { ...msg, isSeen: true } : msg,
        ),
      }));
    });
  },

  initTypingListener: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("typing");
    socket.off("stopTyping");

    socket.on("typing", (senderId) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [senderId]: true },
      }));
    });

    socket.on("stopTyping", (senderId) => {
      set((state) => {
        const update = { ...state.typingUsers };
        delete update[senderId];
        return { typingUsers: update };
      });
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messagesSeenByPeer");
  },
}));

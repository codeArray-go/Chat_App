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
  notifications: {},

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

  getNotification: async () => {
    try {
      const res = await axiosInstance.get("/messages/getNoti");

      const response = res.data; // Array

      set((state) => {
        const updated = { ...state.notifications };
        response.forEach((element) => {
          updated[element._id] = element.count;
        });

        console.log(updated);

        return { notifications: updated };
      });
    } catch (error) {
      toast.error("Something went wrong while fetching notification");
      console.log(error);
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

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    if (!socket || !useAuthStore.getState().authUser) return;

    socket.off("newMessage");
    // socket.off("unreadCount");
    socket.off("messagesSeenByPeer");

    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();

      if (
        selectedUser &&
        (newMessage.senderId === selectedUser._id ||
          newMessage.receiverId === selectedUser._id)
      ) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
    });

    socket.on("unreadCount", (unreadMessages) => {
      if (!Array.isArray(unreadMessages)) return;

      set((state) => {
        const updated = { ...state.notifications };

        unreadMessages.forEach((item) => {
          updated[item._id] = item.count;
        });

        return { notifications: updated };
      });
    });

    socket.on("messagesSeenByPeer", (peerId) => {
      if (!peerId) return;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.receiverId === peerId ? { ...msg, isSeen: true } : msg,
        ),
        notifications: Object.fromEntries(
          Object.entries(state.notifications).filter(
            ([senderId]) => senderId !== peerId,
          ),
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

    // socket.off("newMessage");
    socket.off("messagesSeenByPeer");
  },
}));

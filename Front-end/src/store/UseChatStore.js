import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const UseChatStore = create((set, get) => ({
  text: "",
  allContact: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  typingUsers: {},
  notifications: {},
  searchBarOpen: false,
  notificationCenterOpen: false,
  searchedUser: [],
  isSelectedUserFromList: false,
  replyToMessage: "",
  editProfile: false,

  setEditProfile: (bool) => set({editProfile: bool}),
  setRelyToMessage: (message) => set({ replyToMessage: message }),
  setText: (text) => set({ text: text }),
  setSearchBarOpen: (boolVal) => set({ searchBarOpen: boolVal }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
  setNotificationCenteOpen: (val) => set({ notificationCenterOpen: val }),
  clearSearchedUser: () => set({ searchedUser: [] }),
  setIsSelectedUserFromList: (bool) => set({ isSelectedUserFromList: bool }),

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

  searchInContacts: async (data) => {
    try {
      const res = await axiosInstance.get("/messages/search", { params: data });
      set({ searchedUser: res.data });
    } catch (error) {
      toast.error("error in Searching");
      console.log(error);
    }
  },

  getMyChatPartners: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });

      const socket = useAuthStore.getState().socket;
      if (!socket) return;

      if (!socket || !useAuthStore.getState().authUser) return;

      socket.on("unreadCount", ({ sender, count }) => {
        set((state) => ({
          notifications: { ...state.notifications, [sender]: count },
        }));
      });
    } catch (error) {
      toast.error("error in getting chat partneres");
      console.log(error.response.data.message);
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
          updated[element.id] = element.count;
        });

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
      id: tmpID,
      sender_id: authUser.id,
      receiver_id: selectedUser.id,
      text: messageData.text,
      reply_to: messageData.reply_to,
      image: messageData.image,
      created_at: new Date().toISOString(),
      is_seen: false,
      isOptimistic: true,
    };

    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser.id}`,
        messageData,
      );

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === tmpID ? res.data : msg,
        ),
      }));

      return selectedUser.id;
    } catch (error) {
      set({ messages: messages });
      toast.error(
        error.response?.data?.message ||
          "Something went wrong sending messages.",
      );
    }
  },

  deleteMessage: async (message_id) => {
    const { messages } = get();
    try {
      await axiosInstance.post("/messages/delete", {
        message_id: message_id,
      });

      const updatedMessages = messages.filter((msg) => msg.id !== message_id);
      set({ messages: updatedMessages });
    } catch (error) {
      toast.error("Error while deleting message");
      console.log("Error while deleting message: ", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    if (!socket || !useAuthStore.getState().authUser) return;

    socket.off("newMessage");
    socket.off("unreadCountUpdateAfterSeen");
    socket.off("messagesSeenByPeer");
    socket.off("DeleteMsgId");

    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();

      if (
        selectedUser &&
        (newMessage.sender_id === selectedUser.id ||
          newMessage.receiver_id === selectedUser.id)
      ) {
        set((state) => {
          const exists = state.messages.some((msg) => msg.id === newMessage.id);

          if (exists) return state;

          return {
            messages: [...state.messages, newMessage],
          };
        });
      }
    });

    socket.on("DeletedMsgId", (message_id) => {
      const { messages } = get();

      const updatedMessages = messages.filter((msg) => msg.id !== message_id);
      set({ messages: updatedMessages });
    });

    socket.on("messagesSeenByPeer", (peerId) => {
      if (!peerId) return;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.receiver_id === peerId ? { ...msg, is_seen: true } : msg,
        ),
      }));
    });

    socket.on("unreadCountUpdateAfterSeen", ({ sender, count }) => {
      set((state) => ({
        notifications: {
          ...state.notifications,
          [sender]: count,
        },
      }));
      console.log("notification updated");
    });
  },

  initTypingListener: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("typing");
    socket.off("stopTyping");

    socket.on("typing", (sender_id) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [sender_id]: true },
      }));
    });

    socket.on("stopTyping", (sender_id) => {
      set((state) => {
        const update = { ...state.typingUsers };
        delete update[sender_id];
        return { typingUsers: update };
      });
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messagesSeenByPeer");
    socket.off("unreadCountUpdateAfterSeen");
  },
}));

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";
import { UseChatStore } from "./store/UseChatStore";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authUser) return;

    UseChatStore.getState().getNotification();
    UseChatStore.getState().initTypingListener();
  }, [authUser]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="h-screen bg-slate-900 overflow-hidden w-screen">
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;

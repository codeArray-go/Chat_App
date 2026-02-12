import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";
import { UseChatStore } from "./store/UseChatStore";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

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
    <div className="h-screen overflow-hidden w-screen">
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/Dashboard"
          element={authUser ? <Dashboard /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/Home"
          element={authUser ? <Home /> : <Navigate to={"/Login"} />}
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

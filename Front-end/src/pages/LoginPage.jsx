import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLogginIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-[#06070a] relative overflow-hidden flex items-center justify-center px-4">

      {/* subtle radial glow */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-neutral-700 blur-[140px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-neutral-800 blur-[140px] rounded-full" />
      </div>

      {/* main container */}
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT — Illustration side (top on mobile) */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">

          <img
            src="https://illustrations.popsy.co/gray/work-from-home.svg"
            alt="Chat illustration"
            className="w-[420px] max-w-full opacity-90"
          />

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-neutral-200">
              Conversations, simplified
            </h2>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              A distraction-free messaging experience designed with clarity,
              privacy, and speed in mind.
            </p>
          </div>
        </div>

        {/* RIGHT — Floating login card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-neutral-900/70 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 sm:p-10">

            {/* Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
                <MessageCircleIcon className="w-6 h-6 text-neutral-300" />
              </div>

              <h1 className="text-2xl font-semibold text-neutral-100">
                Welcome back
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                Sign in to continue your secure chats
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Email</label>

                <div className="relative">
                  <MailIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Password</label>

                <div className="relative">
                  <LockIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 transition"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLogginIn}
                className="w-full py-2.5 rounded-lg bg-neutral-200 text-neutral-900 font-medium hover:bg-neutral-300 active:scale-[0.98] transition flex items-center justify-center disabled:opacity-60"
              >
                {isLogginIn ? (
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-xs text-neutral-500 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-neutral-200 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

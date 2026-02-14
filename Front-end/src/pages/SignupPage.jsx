import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-[#06070a] flex">

      {/* LEFT — Slim illustration panel (different from login) */}
      <div className="hidden lg:flex w-[38%] border-r border-neutral-900 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200"
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative z-10 flex flex-col justify-center px-10">
          <h2 className="text-2xl font-semibold text-neutral-100 leading-tight">
            Build meaningful
            <br /> conversations.
          </h2>

          <p className="text-neutral-400 text-sm mt-4 max-w-xs">
            Create your account and start chatting in a calm,
            distraction-free environment designed for clarity.
          </p>
        </div>
      </div>

      {/* RIGHT — Centered signup card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.65)] p-8">

          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
              <MessageCircleIcon className="w-6 h-6 text-neutral-300" />
            </div>

            <h1 className="text-xl font-semibold text-neutral-100">
              Create your account
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              It only takes a few seconds
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME */}
            <div className="relative">
              <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Full name"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <MailIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email address"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <LockIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-2.5 rounded-lg bg-neutral-200 text-neutral-900 font-medium hover:bg-neutral-300 active:scale-[0.98] transition flex items-center justify-center disabled:opacity-60"
            >
              {isSigningUp ? (
                <LoaderIcon className="w-4 h-4 animate-spin" />
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-xs text-neutral-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-neutral-200 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;

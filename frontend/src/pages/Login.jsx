import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import AppCredit from "../components/AppCredit";

const inputClass =
  "block w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      const response = await authAPI.login(loginData);
      return response;
    },
    onSuccess: (response) => {
      if (response?.status === 200 || response?.status === 201) {
        setLoginSuccess(true);
        toast.success("Successfully logged in!");
      }
    },
    onError: (error) => {
      if (error.response?.status === 403) {
        const message =
          error.response?.data?.message ||
          "Your password has expired. Please reset your password.";
        setError(message);
        toast.error(message, {
          duration: 5000,
          icon: "🔒",
        });
        // Redirect to password reset page
        navigate("/reset-password");
      } else if (error.response?.status === 429) {
        const message =
          error.response?.data?.message ||
          "Too many login attempts. Please try again later.";
        setError(message);
        toast.error(message, {
          duration: 5000,
          icon: "🚫",
        });
      } else {
        const errorMessage = error.response?.data?.message || "Login failed";
        setError(errorMessage);
        toast.error(errorMessage);
      }
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    },
  });

  useEffect(() => {
    if (loginSuccess) {
      navigate("/dashboard");
    }
  }, [loginSuccess, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoginSuccess(false);

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    loginMutation.mutate(loginData);
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-200 font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-[26rem] h-[26rem] bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <img
            src="/logo-with-text.png"
            alt="My Invoice"
            className="h-12 w-auto mx-auto"
          />
        </Link>
        <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl py-8 px-6 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="remember-me"
                className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
              >
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                Remember me
              </label>

              <Link
                to="/reset-password"
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Create a new account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Protected by industry-standard encryption.
        </p>

        <AppCredit className="mt-6 text-center" />
      </div>
    </div>
  );
}

export default Login;

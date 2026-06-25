import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const inputClass =
  "block w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "" };

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains number
    if (/\d/.test(password)) strength += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    const strengthMap = {
      0: { label: "Insecure", color: "bg-red-500", allowed: false },
      1: { label: "Insecure", color: "bg-red-500", allowed: false },
      2: { label: "Low", color: "bg-orange-500", allowed: false },
      3: { label: "Medium", color: "bg-yellow-500", allowed: true },
      4: { label: "Secure", color: "bg-green-500", allowed: true },
      5: { label: "Very Secure", color: "bg-green-600", allowed: true },
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!passwordStrength.allowed) {
      const errorMsg = "Please choose a stronger password";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Send only the required data to API
    const registerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    registerMutation.mutate(registerData);
  };

  const checkItem = (ok) => (ok ? "text-emerald-400" : "text-gray-500");

  return (
    <div className="relative min-h-screen bg-black text-gray-200 font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-[26rem] h-[26rem] bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="text-3xl font-display font-bold text-white">
          <span className="text-blue-500">My</span>-Invoice
        </Link>
        <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl py-8 px-6 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-200 mb-1.5"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-200 mb-1.5"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      passwordStrength.allowed
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    Password strength: {passwordStrength.label}
                  </p>
                  <ul className="text-xs space-y-1 ml-4 list-disc">
                    <li className={checkItem(formData.password.length >= 8)}>
                      At least 8 characters
                    </li>
                    <li className={checkItem(/\d/.test(formData.password))}>
                      Contains a number
                    </li>
                    <li className={checkItem(/[a-z]/.test(formData.password))}>
                      Contains a lowercase letter
                    </li>
                    <li className={checkItem(/[A-Z]/.test(formData.password))}>
                      Contains an uppercase letter
                    </li>
                    <li
                      className={checkItem(
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      )}
                    >
                      Contains a special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-200 mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STAFF = [
  { name: "Justin", email: "justin@rehab.com", initials: "J" },
  { name: "Luyolo", email: "luyolo@rehab.com", initials: "L" },
  { name: "Tasneem", email: "tasneem@rehab.com", initials: "T" },
  { name: "Zoe", email: "zoe@rehab.com", initials: "Z" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // PIN login state
  const [selectedStaff, setSelectedStaff] = useState<typeof STAFF[0] | null>(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  function selectStaff(staff: typeof STAFF[0]) {
    setSelectedStaff(staff);
    setPin(["", "", "", ""]);
    setError("");
    setTimeout(() => pinRefs.current[0]?.focus(), 50);
  }

  function handlePinChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (value && index === 3) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join("");
      if (fullPin.length === 4 && selectedStaff) {
        handlePinLogin(selectedStaff.email, fullPin);
      }
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  }

  async function handlePinLogin(staffEmail: string, staffPin: string) {
    setError("");
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: staffEmail,
        password: staffPin,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid PIN");
        setPin(["", "", "", ""]);
        pinRefs.current[0]?.focus();
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">RehabPrescriber</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Staff Quick Login */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Quick login
          </p>
          <div className="grid grid-cols-4 gap-2">
            {STAFF.map((s) => (
              <button
                key={s.email}
                onClick={() => selectStaff(s)}
                className={`flex flex-col items-center gap-1 py-3 rounded-lg border-2 transition-colors ${
                  selectedStaff?.email === s.email
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                    selectedStaff?.email === s.email
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {s.initials}
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {s.name}
                </span>
              </button>
            ))}
          </div>

          {/* PIN input */}
          {selectedStaff && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 text-center mb-3">
                Enter PIN for <span className="font-semibold">{selectedStaff.name}</span>
              </p>
              <div className="flex justify-center gap-3">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { pinRefs.current[i] = el; }}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    disabled={isLoading}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setSelectedStaff(null);
                  setPin(["", "", "", ""]);
                  setError("");
                }}
                className="block mx-auto mt-3 text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">
              or use email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

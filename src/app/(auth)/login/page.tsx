"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const STAFF = [
  { name: "Justin", email: "justin@rehab.com", initials: "J" },
  { name: "Luyolo", email: "luyolo@rehab.com", initials: "L" },
  { name: "Tasneem", email: "tasneem@rehab.com", initials: "T" },
  { name: "Zoe", email: "zoe@rehab.com", initials: "Z" },
];

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        setTimeout(() => pinRefs.current[0]?.focus(), 50);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">RehabPrescriber</h1>
          <p className="text-gray-500 mt-2">Select your profile to sign in</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!selectedStaff ? (
          <div className="grid grid-cols-2 gap-3">
            {STAFF.map((s) => (
              <button
                key={s.email}
                onClick={() => selectStaff(s)}
                className="flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 text-gray-700 text-lg font-bold">
                  {s.initials}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center mb-6">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold mb-2">
                {selectedStaff.initials}
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {selectedStaff.name}
              </p>
            </div>

            <p className="text-sm text-gray-500 text-center mb-4">
              Enter your 4-digit PIN
            </p>

            <div className="flex justify-center gap-3 mb-6">
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
                  className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              ))}
            </div>

            {isLoading && (
              <p className="text-sm text-gray-500 text-center mb-4">
                Signing in...
              </p>
            )}

            <button
              onClick={() => {
                setSelectedStaff(null);
                setPin(["", "", "", ""]);
                setError("");
              }}
              className="block mx-auto text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to profiles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

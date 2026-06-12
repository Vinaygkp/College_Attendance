import { useState } from "react";
import { GraduationCap, Eye, EyeOff, AlertCircle, Shield, BookOpen, Users } from "lucide-react";

interface LoginPageProps {
  onLogin: (studentId: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const cleanStudentId = studentId.trim().toUpperCase();
    const cleanPassword = password.trim();

    if (!cleanStudentId) { setError("Please enter your Student ID / Admission No."); return; }
    if (!cleanPassword) { setError("Please enter your registered mobile number."); return; }

    setLoading(true);
    
    setTimeout(() => {
      // Allowed production credentials in uppercase
      const validIds = ["2024B0311103", "2024B0311104", "2024B0311105"];
      
      if (validIds.includes(cleanStudentId) && (cleanPassword === "9876543210" || cleanPassword === "aims@123")) {
        try {
          if (typeof onLogin === "function") {
            onLogin(cleanStudentId);
          } else {
            throw new Error("Parent handler missing");
          }
        } catch (err) {
          console.warn("onLogin prop execution failed, handling transition state gracefully.", err);
          setLoading(false);
        }
      } else {
        setError("Invalid credentials. Please enter your correct Admission No & Mobile No.");
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(160deg, #071526 0%, #0f2d5a 50%, #1d4ed8 100%)" }}
    >
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">ABES Engineering College</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-xs">
          <Shield className="w-3 h-3" />
          <span>Secure Portal</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex">
        {/* Left panel — desktop only */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12 relative">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 40%)" }} />
          <div className="relative max-w-sm">
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-6 border border-white/20">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-white text-4xl font-black leading-tight mb-4">
              AIMS Student<br />Portal
            </h1>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              Access your attendance records, subject details, quiz attempts, and academic overview — all in one place.
            </p>

            <div className="space-y-4">
              {[
                { icon: BookOpen, title: "Live Attendance", desc: "Subject-wise & overall with 75% alerts" },
                { icon: Shield, title: "Quiz System", desc: "Attempt quizzes using faculty-shared codes" },
                { icon: Users, title: "Personal Dashboard", desc: "Only you can access your own records" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                    <Icon className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <p className="text-white/50 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — login form */}
        <div className="flex-1 lg:max-w-md flex items-center justify-center p-6 lg:p-10">
          <div className="w-full">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Card top accent */}
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #0f2d5a, #1d4ed8, #60a5fa)" }} />

              <div className="p-8">
                <div className="mb-7">
                  <h2 className="text-[#0f1d2e] font-black text-2xl mb-1">Student Login</h2>
                  <p className="text-[#52677e] text-sm">Sign in with your ABES AIMS credentials</p>
                </div>

                {error && (
                  <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-red-600 text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[#0f1d2e] text-sm font-semibold mb-2">Admission No / Student ID</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      placeholder="e.g. 2024B0311103"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#e4ecf8] bg-[#f5f8fc] text-[#0f1d2e] placeholder-[#94a3b8] focus:outline-none focus:border-[#1d4ed8] transition font-mono font-semibold tracking-wide"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0f1d2e] text-sm font-semibold mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Registered Mobile Number"
                        className="w-full px-4 py-3.5 pr-12 rounded-2xl border-2 border-[#e4ecf8] bg-[#f5f8fc] text-[#0f1d2e] placeholder-[#94a3b8] focus:outline-none focus:border-[#1d4ed8] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f2d5a] transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl font-bold text-white transition-all mt-2"
                    style={{
                      background: loading ? "#cbd5e1" : "linear-gradient(135deg, #0f2d5a 0%, #1d4ed8 100%)",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: loading ? "none" : "0 4px 20px rgba(29,78,216,0.35)"
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : "Login to AIMS Portal"}
                  </button>
                </form>
              </div>
            </div>

            <p className="text-center text-white/30 text-xs mt-5">
              © 2026 ABES Engineering College · AIMS Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
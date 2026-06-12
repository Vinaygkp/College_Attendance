import { useState } from "react";
import {
  GraduationCap, LogOut, LayoutDashboard, BookOpen, User,
  TrendingUp, AlertTriangle, CheckCircle, Bell, ChevronRight,
  BookMarked, Calendar, Award, Plus, Minus, Calculator
} from "lucide-react";
import { 
  Student, 
  getAttendancePercent, 
  overallClassesNeededFor75, 
  overallCanBunkClasses,
  classesNeededFor75
} from "./attendanceData";
import { SubjectCard } from "./SubjectCard";
import { RadialProgress } from "./RadialProgress";
import { QuizPortal } from "./QuizPortal";
import { QuizAttempt } from "./quizData";

interface DashboardProps {
  student: Student;
  onLogout: () => void;
}

export function Dashboard({ student, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "subjects" | "quiz" | "profile">("overview");
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Baseline data setup from current actual database pool
  const totalClasses = student.subjects.reduce((s, sub) => s + sub.totalClasses, 0);
  const totalAttended = student.subjects.reduce((s, sub) => s + sub.attendedClasses, 0);
  const overallPercent = getAttendancePercent(totalAttended, totalClasses);
  const lowSubjects = student.subjects.filter(s => getAttendancePercent(s.attendedClasses, s.totalClasses) < 75);
  const goodSubjects = student.subjects.filter(s => getAttendancePercent(s.attendedClasses, s.totalClasses) >= 75);

  // ── INTERACTIVE CALCULATOR LOCAL STATES ──
  const [calcAttended, setCalcAttended] = useState(totalAttended);
  const [calcTotal, setCalcTotal] = useState(totalClasses);

  const calcPercent = getAttendancePercent(calcAttended, calcTotal);
  const calcNeeded = overallClassesNeededFor75(calcAttended, calcTotal);
  const calcCanBunk = overallCanBunkClasses(calcAttended, calcTotal);

  const tabs = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "subjects", label: "Subjects", icon: BookOpen },
    { key: "quiz", label: "Quiz", icon: BookMarked },
    { key: "profile", label: "Profile", icon: User },
  ] as const;

  const alertCount = lowSubjects.length;

  return (
    <div className="min-h-screen" style={{ background: "#eef2f7", fontFamily: "'Inter', sans-serif" }}>
      {/* ── TOP NAV (mobile) ── */}
      <header
        className="lg:hidden sticky top-0 z-20"
        style={{ background: "linear-gradient(135deg, #0f2d5a 0%, #1d4ed8 100%)" }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">ABES Engineering College</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {alertCount > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5 text-white/70" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {alertCount}
                </span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
        <div className="flex border-t border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5"
              style={{
                color: activeTab === tab.key ? "#ffffff" : "rgba(255,255,255,0.5)",
                borderBottom: activeTab === tab.key ? "2px solid #ffffff" : "2px solid transparent",
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="lg:flex lg:min-h-screen">
        <aside
          className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0"
          style={{ background: "linear-gradient(180deg, #0a1f3d 0%, #0f2d5a 60%, #1d4ed8 100%)" }}
        >
          <div className="px-6 pt-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold leading-tight text-base">ABES Engineering College</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-sm bg-white/20">
                {student.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{student.name}</p>
                <p className="text-white/50 text-xs">{student.rollNo}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: activeTab === tab.key ? "rgba(255,255,255,0.15)" : "transparent",
                  color: activeTab === tab.key ? "#ffffff" : "rgba(255,255,255,0.55)",
                }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.key === "overview" && alertCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {alertCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-4 pb-6">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Main core slot */}
        <main className="lg:ml-64 flex-1 p-4 lg:p-8">
          {/* Desktop page title layout */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[#0f1d2e] font-bold text-2xl">
                {activeTab === "overview" && "Dashboard"}
                {activeTab === "subjects" && "Subject Attendance"}
                {activeTab === "quiz" && "Quiz Portal"}
                {activeTab === "profile" && "My Profile"}
              </h1>
              <p className="text-[#52677e] text-sm mt-0.5">
                {student.name} · {student.rollNo} · {student.semester}
              </p>
            </div>
            {alertCount > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
                <Bell className="w-4 h-4" />
                <span className="font-medium">{alertCount} subjects below 75%</span>
              </div>
            )}
          </div>

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              
              {/* Main Display Score Frame */}
              <div
                className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0f2d5a 0%, #1d4ed8 100%)" }}
              >
                <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10"
                  style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Overall Real Attendance</p>
                    <p className="text-6xl font-black leading-none mb-1">{overallPercent}<span className="text-3xl text-white/50">%</span></p>
                    <p className="text-white/60 text-sm">{totalAttended} of {totalClasses} classes attended</p>
                    <div className="mt-3">
                      {overallPercent >= 75 ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Above 75% requirement
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 text-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Below 75% requirement
                        </span>
                      )}
                    </div>
                  </div>
                  <RadialProgress percent={overallPercent} size={110} />
                </div>

                {/* Threshold progress line */}
                <div className="mt-5 relative">
                  <div className="flex justify-between text-xs text-white/40 mb-1.5">
                    <span>0%</span>
                    <span className="text-yellow-300 font-semibold">▲ 75% minimum</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${overallPercent}%`,
                        background: overallPercent >= 75
                          ? "linear-gradient(90deg, #4ade80, #22c55e)"
                          : "linear-gradient(90deg, #f87171, #ef4444)"
                      }}
                    />
                  </div>
                  <div className="absolute top-5 w-0.5 h-2 bg-yellow-300" style={{ left: "75%" }} />
                </div>
              </div>

              {/* 🧮 INTERACTIVE LIVE CALCULATOR WIDGET */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4ecf8] space-y-4">
                <div className="flex items-center gap-3 border-b border-[#eef2f7] pb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#0f1d2e] font-bold text-sm">Attendance Calculator</h3>
                    <p className="text-[#52677e] text-xs">Calculate your future targets and bunk margins accurately.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  {/* Left Side Controls */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[#52677e] text-xs font-semibold block mb-1.5">Simulate Attended Lectures</label>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setCalcAttended(Math.max(0, calcAttended - 1))}
                          className="w-9 h-9 border border-[#e4ecf8] hover:bg-slate-50 transition rounded-xl flex items-center justify-center text-slate-600 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input 
                          type="number" 
                          value={calcAttended} 
                          onChange={(e) => setCalcAttended(Math.max(0, parseInt(e.target.value) || 0))}
                          className="flex-1 text-center h-9 border border-[#e4ecf8] bg-slate-50/50 font-bold text-sm text-[#0f1d2e] rounded-xl"
                        />
                        <button 
                          onClick={() => { setCalcAttended(calcAttended + 1); if(calcAttended >= calcTotal) setCalcTotal(calcTotal + 1); }}
                          className="w-9 h-9 border border-[#e4ecf8] hover:bg-slate-50 transition rounded-xl flex items-center justify-center text-slate-600 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#52677e] text-xs font-semibold block mb-1.5">Simulate Total Conducted Lectures</label>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setCalcTotal(Math.max(calcAttended, calcTotal - 1))}
                          className="w-9 h-9 border border-[#e4ecf8] hover:bg-slate-50 transition rounded-xl flex items-center justify-center text-slate-600 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input 
                          type="number" 
                          value={calcTotal} 
                          onChange={(e) => setCalcTotal(Math.max(calcAttended, parseInt(e.target.value) || 0))}
                          className="flex-1 text-center h-9 border border-[#e4ecf8] bg-slate-50/50 font-bold text-sm text-[#0f1d2e] rounded-xl"
                        />
                        <button 
                          onClick={() => setCalcTotal(calcTotal + 1)}
                          className="w-9 h-9 border border-[#e4ecf8] hover:bg-slate-50 transition rounded-xl flex items-center justify-center text-slate-600 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setCalcAttended(totalAttended); setCalcTotal(totalClasses); }}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      Reset to Real College Values
                    </button>
                  </div>

                  {/* Right Side Predicted Display Outputs */}
                  <div className="bg-[#f8fafc] border border-[#eef2f7] rounded-xl p-4 flex flex-col justify-center gap-3">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-xs font-medium text-[#52677e]">Simulated Score:</span>
                      <span className="text-lg font-black" style={{ color: calcPercent >= 75 ? "#16a34a" : "#dc2626" }}>{calcPercent}%</span>
                    </div>

                    {calcPercent < 75 ? (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wide">Target Prediction</span>
                        <p className="text-amber-800 text-xs font-medium mt-0.5 leading-relaxed">
                          You need to attend next <strong className="text-sm font-black text-amber-700">{calcNeeded}</strong> classes consecutively to patch back up to 75%.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wide">Safe Margin Prediction</span>
                        <p className="text-emerald-800 text-xs font-medium mt-0.5 leading-relaxed">
                          You can safely bunk/skip next <strong className="text-sm font-black text-emerald-700">{calcCanBunk}</strong> classes back-to-back without dropping below 75%.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total Subjects", value: student.subjects.length, icon: BookOpen, color: "#1d4ed8", bg: "#eff6ff" },
                  { label: "Above 75%", value: goodSubjects.length, icon: CheckCircle, color: "#16a34a", bg: "#f0fdf4" },
                  { label: "Below 75%", value: lowSubjects.length, icon: AlertTriangle, color: "#dc2626", bg: "#fef2f2" },
                  { label: "Quizzes Done", value: quizAttempts.length, icon: BookMarked, color: "#d97706", bg: "#fffbeb" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e4ecf8] flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center" style={{ background: bg }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-black text-2xl text-[#0f1d2e] leading-none">{value}</p>
                      <p className="text-[#52677e] text-xs mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject Breakdown Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e4ecf8] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#eef2f7] flex items-center justify-between">
                  <h2 className="text-[#0f1d2e] font-bold text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#1d4ed8]" /> Subject Breakdown
                  </h2>
                  <button
                    onClick={() => setActiveTab("subjects")}
                    className="text-xs text-[#1d4ed8] flex items-center gap-0.5 font-bold hover:underline"
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="divide-y divide-[#f5f8fc]">
                  {student.subjects.map((sub, i) => {
                    const pct = getAttendancePercent(sub.attendedClasses, sub.totalClasses);
                    const crit = pct < 60;
                    const low = pct < 75 && !crit;
                    const barColor = crit ? "#dc2626" : low ? "#f59e0b" : "#16a34a";
                    return (
                      <div key={sub.code} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#fafbff] transition">
                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-black bg-slate-800">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#0f1d2e] text-sm font-semibold truncate">{sub.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-[#e4ecf8] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: barColor }} />
                            </div>
                            <span className="font-bold text-xs" style={{ color: barColor }}>{pct}%</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold shrink-0 bg-slate-100 px-2.5 py-1 rounded-full text-slate-600">
                          {sub.attendedClasses}/{sub.totalClasses}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Warning Alert Box */}
              {lowSubjects.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <h3 className="text-red-700 font-bold text-sm flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4" /> Attendance Warning
                  </h3>
                  <div className="space-y-2.5">
                    {lowSubjects.map(sub => {
                      const pct = getAttendancePercent(sub.attendedClasses, sub.totalClasses);
                      const needed = classesNeededFor75(sub.attendedClasses, sub.totalClasses);
                      return (
                        <div key={sub.code} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-red-100 shadow-sm">
                          <div>
                            <p className="text-[#0f1d2e] text-sm font-semibold">{sub.name}</p>
                            <p className="text-[#52677e] text-xs font-mono">{sub.code}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-red-600 font-black text-sm">{pct}%</p>
                            <p className="text-red-500 text-xs font-medium">Need {needed} more classes</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── SUBJECTS TAB ─── */}
          {activeTab === "subjects" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e4ecf8] text-center">
                  <p className="text-2xl font-black text-[#0f1d2e]">{totalAttended}</p>
                  <p className="text-[#52677e] text-xs mt-0.5">Classes Attended</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e4ecf8] text-center">
                  <p className="text-2xl font-black text-red-500">{totalClasses - totalAttended}</p>
                  <p className="text-[#52677e] text-xs mt-0.5">Classes Absent</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e4ecf8] text-center">
                  <p className="text-2xl font-black" style={{ color: overallPercent >= 75 ? "#16a34a" : "#dc2626" }}>{overallPercent}%</p>
                  <p className="text-[#52677e] text-xs mt-0.5">Overall</p>
                </div>
              </div>
              {student.subjects.map((sub, i) => (
                <SubjectCard key={sub.code} subject={sub} index={i} />
              ))}
            </div>
          )}

          {/* ─── QUIZ TAB ─── */}
          {activeTab === "quiz" && (
            <QuizPortal
              studentId={student.rollNo || student.id}
              attempts={quizAttempts}
              onAttemptComplete={attempt => setQuizAttempts(prev => [...prev, attempt])}
            />
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              {/* Profile Card Container with Relative layout */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e4ecf8] overflow-hidden relative">
                
                {/* 🌟 FIXED: STRIPE AND HIGHLIGHT BOX PACKED FLUSH PERFECTLY WITH NO OVERFLOW EXTRA SPACING 🌟 */}
                <div 
                  className="p-4 flex flex-col justify-center relative" 
                  style={{ background: "linear-gradient(135deg, #0f2d5a, #1d4ed8)" }}
                >
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)" }} />
                  
                  {/* Dark Blue Highlighted Container Box */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-xl border relative z-10 w-full transition-all duration-300"
                    style={{ 
                      background: "linear-gradient(135deg, #0a1f3d 0%, #0f2d5a 100%)", 
                      borderColor: "rgba(255, 255, 255, 0.18)",
                      boxShadow: "0 8px 20px rgba(10, 31, 61, 0.4)"
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl border-2 border-white/20 shadow-inner flex items-center justify-center text-white text-xl font-black shrink-0"
                      style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(5px)" }}
                    >
                      {student.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-white font-bold text-xl tracking-wide leading-tight">{student.name}</h2>
                      <p className="text-white/60 text-xs font-mono mt-0.5">{student.rollNo}</p>
                    </div>
                  </div>
                </div>

                {/* Profile key-value data list section inside the core white area */}
                <div className="px-6 pb-6 pt-4">
                  <div className="grid grid-cols-1 gap-0 divide-y divide-[#f5f8fc]">
                    {[
                      { label: "Admission / Roll Number", value: student.rollNo, color: "#1d4ed8" },
                      { label: "Branch", value: student.branch, color: "#0f2d5a" },
                      { label: "Semester", value: student.semester, color: "#0f2d5a" },
                      { label: "Section", value: `Section ${student.section}`, color: "#0f2d5a" },
                      { label: "Email", value: student.email, color: "#0f2d5a" },
                      { label: "Phone", value: student.phone, color: "#0f2d5a" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-3.5">
                        <span className="text-[#52677e] text-sm font-medium">{item.label}</span>
                        <span className="text-sm font-semibold text-right" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attendance Statistics Summary Grid Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e4ecf8] p-5">
                <h3 className="text-[#0f1d2e] font-bold text-sm flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#1d4ed8]" /> Attendance Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Overall", v: `${overallPercent}%`, c: overallPercent >= 75 ? "#16a34a" : "#dc2626", bg: overallPercent >= 75 ? "#f0fdf4" : "#fef2f2" },
                    { l: "Total Classes", v: totalClasses, c: "#0f2d5a", bg: "#eff6ff" },
                    { l: "Attended", v: totalAttended, c: "#16a34a", bg: "#f0fdf4" },
                    { l: "Absent", v: totalClasses - totalAttended, c: "#dc2626", bg: "#fef2f2" },
                  ].map(({ l, v, c, bg }) => (
                    <div key={l} className="p-4 rounded-xl" style={{ background: bg }}>
                      <p className="text-[#52677e] text-xs mb-1 font-semibold">{l}</p>
                      <p className="font-black text-2xl" style={{ color: c }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  BookMarked, Key, Clock, Award, ChevronRight, CheckCircle, XCircle,
  AlertCircle, RotateCcw, Trophy, Target, ArrowRight, Hash
} from "lucide-react";
import { availableQuizzes, QuizAttempt, Quiz } from "./quizData";

interface QuizPortalProps {
  studentId: string;
  attempts: QuizAttempt[];
  onAttemptComplete: (attempt: QuizAttempt) => void;
}

type Screen = "home" | "enter-code" | "quiz-info" | "taking-quiz" | "result" | "attempt-review";

export function QuizPortal({ studentId, attempts, onAttemptComplete }: QuizPortalProps) {
  const [screen, setScreen] = useState<Screen>("home");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [lastResult, setLastResult] = useState<QuizAttempt | null>(null);
  const [reviewAttempt, setReviewAttempt] = useState<QuizAttempt | null>(null);

  // Interval cleanup side-effect memory guard
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const handleEnterCode = () => {
    const cleanCode = code.trim().toUpperCase();
    const quiz = availableQuizzes[cleanCode];
    
    if (!quiz) {
      setCodeError("Invalid quiz code. Please check with your faculty.");
      return;
    }
    const alreadyAttempted = attempts.find(a => a.quizCode === quiz.code);
    if (alreadyAttempted) {
      setCodeError("You have already attempted this quiz.");
      return;
    }
    setCodeError("");
    setCurrentQuiz(quiz);
    setScreen("quiz-info");
  };

  const startQuiz = () => {
    if (!currentQuiz) return;
    setSelectedAnswers(new Array(currentQuiz.questions.length).fill(-1));
    setCurrentQ(0);
    setTimeLeft(currentQuiz.duration * 60);
    setScreen("taking-quiz");

    const iv = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(iv);
  };

  // Timer runout tracker handler
  useEffect(() => {
    if (screen === "taking-quiz" && timeLeft === 0 && timerInterval) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, [timeLeft, screen]);

  const submitQuiz = () => {
    if (!currentQuiz) return;
    if (timerInterval) clearInterval(timerInterval);

    const score = selectedAnswers.reduce((acc, ans, i) => {
      return acc + (ans === currentQuiz.questions[i].correctIndex ? 1 : 0);
    }, 0);

    const attempt: QuizAttempt = {
      quizCode: currentQuiz.code,
      quizTitle: currentQuiz.title,
      subject: currentQuiz.subject,
      attemptedAt: new Date().toISOString().slice(0, 10),
      score,
      totalMarks: currentQuiz.totalMarks,
      timeTaken: currentQuiz.duration - Math.floor(timeLeft / 60),
      answers: [...selectedAnswers],
    };

    setLastResult(attempt);
    onAttemptComplete(attempt);
    setScreen("result");
    setTimerInterval(null);
  };

  const selectAnswer = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQ] = optionIndex;
    setSelectedAnswers(updated);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const answered = selectedAnswers.filter(a => a !== -1).length;
  const pct = currentQuiz ? Math.round((answered / currentQuiz.questions.length) * 100) : 0;

  // ── HOME SCREEN ──
  if (screen === "home") {
    return (
      <div className="space-y-5">
        {/* Hero CTA */}
        <div
          className="rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f2d5a 0%, #1d4ed8 100%)" }}
        >
          <div className="absolute right-0 top-0 w-40 h-40 opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-3">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">Quiz Attempts</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Your faculty shares a unique quiz code in class. Enter it here to unlock and attempt the quiz.
            </p>
            <button
              onClick={() => { setCode(""); setCodeError(""); setScreen("enter-code"); }}
              className="inline-flex items-center gap-2 bg-white text-[#0f2d5a] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/90 transition"
            >
              <Key className="w-4 h-4" /> Enter Quiz Code
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Attempted", value: attempts.length, icon: CheckCircle, color: "#1d4ed8" },
            {
              label: "Avg Score",
              value: attempts.length
                ? `${Math.round(attempts.reduce((s, a) => s + Math.round((a.score / a.totalMarks) * 100), 0) / attempts.length)}%`
                : "—",
              icon: Target,
              color: "#16a34a",
            },
            {
              label: "Best",
              value: attempts.length
                ? `${Math.max(...attempts.map(a => Math.round((a.score / a.totalMarks) * 100)))}%`
                : "—",
              icon: Trophy,
              color: "#d97706",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center border border-[#e4ecf8]">
              <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
              <p className="font-bold text-lg text-[#0f1d2e]">{value}</p>
              <p className="text-[#52677e] text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Attempt history */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e4ecf8] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#eef2f7]">
            <h3 className="font-semibold text-[#0f1d2e] text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1d4ed8]" /> Attempt History
            </h3>
          </div>
          {attempts.length === 0 ? (
            <div className="py-12 text-center">
              <BookMarked className="w-10 h-10 text-[#d8e2ef] mx-auto mb-3" />
              <p className="text-[#52677e] text-sm">No quiz attempts yet.</p>
              <p className="text-[#94a3b8] text-xs mt-1">Enter a code from your faculty to start.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f5f8fc]">
              {attempts.map((a, i) => {
                const scorePct = Math.round((a.score / a.totalMarks) * 100);
                const color = scorePct >= 80 ? "#16a34a" : scorePct >= 50 ? "#d97706" : "#dc2626";
                const bg = scorePct >= 80 ? "#dcfce7" : scorePct >= 50 ? "#fef3c7" : "#fee2e2";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setReviewAttempt(a); setScreen("attempt-review"); }}
                    className="w-full px-5 py-4 flex items-center gap-3 hover:bg-[#f8fafc] transition text-left"
                  >
                    <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, #0f2d5a, #1d4ed8)" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0f1d2e] text-sm font-semibold truncate">{a.quizTitle}</p>
                      <p className="text-[#52677e] text-xs mt-0.5">{a.subject} · {a.attemptedAt}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: bg, color }}>
                        {a.score}/{a.totalMarks}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ENTER CODE SCREEN ──
  if (screen === "enter-code") {
    return (
      <div className="space-y-5">
        <button onClick={() => setScreen("home")} className="text-[#1d4ed8] text-sm flex items-center gap-1 hover:underline">
          ← Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e4ecf8] p-6">
          <div className="w-14 h-14 rounded-2xl bg-[#e4ecf8] flex items-center justify-center mb-4">
            <Key className="w-7 h-7 text-[#1d4ed8]" />
          </div>
          <h2 className="text-[#0f1d2e] font-bold text-lg mb-1">Enter Quiz Code</h2>
          <p className="text-[#52677e] text-sm mb-5">
            Your faculty will share a unique code for today's quiz. Enter it exactly as given.
          </p>

          {codeError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-600 text-sm">{codeError}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[#0f1d2e] text-sm font-semibold mb-2 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-[#1d4ed8]" /> Quiz Code
            </label>
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError(""); }}
              placeholder="e.g. OS401"
              maxLength={5}
              onKeyDown={e => e.key === "Enter" && handleEnterCode()}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e4ecf8] bg-[#f5f8fc] text-[#0f1d2e] placeholder-[#94a3b8] focus:outline-none focus:border-[#1d4ed8] transition font-mono text-lg tracking-widest font-bold"
            />
          </div>

          <button
            onClick={handleEnterCode}
            disabled={!code.trim()}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition"
            style={{
              background: code.trim() ? "linear-gradient(135deg, #0f2d5a, #1d4ed8)" : "#cbd5e1",
              cursor: code.trim() ? "pointer" : "not-allowed"
            }}
          >
            Unlock Quiz <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ INFO SCREEN ──
  if (screen === "quiz-info" && currentQuiz) {
    return (
      <div className="space-y-5">
        <button onClick={() => setScreen("enter-code")} className="text-[#1d4ed8] text-sm flex items-center gap-1 hover:underline">
          ← Back
        </button>
        <div className="bg-white rounded-2xl border border-[#e4ecf8] shadow-sm overflow-hidden">
          <div className="p-6" style={{ background: "linear-gradient(135deg, #0f2d5a, #1d4ed8)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-mono font-bold">{currentQuiz.code}</span>
              <span className="bg-green-400/20 text-green-200 text-xs px-2.5 py-1 rounded-full font-medium">Active</span>
            </div>
            <h2 className="text-white font-bold text-xl mb-0.5">{currentQuiz.title}</h2>
            <p className="text-white/70 text-sm">{currentQuiz.subject} · {currentQuiz.subjectCode}</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { icon: BookMarked, label: "Questions", value: `${currentQuiz.questions.length} MCQs` },
                { icon: Clock, label: "Duration", value: `${currentQuiz.duration} minutes` },
                { icon: Award, label: "Total Marks", value: `${currentQuiz.totalMarks} marks` },
                { icon: Target, label: "Faculty", value: currentQuiz.faculty },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-3 bg-[#f5f8fc] rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5 text-[#1d4ed8]" />
                    <span className="text-[#52677e] text-xs">{label}</span>
                  </div>
                  <p className="text-[#0f1d2e] text-sm font-semibold truncate">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 mb-5">
              <p className="text-[#92400e] text-xs font-semibold mb-1">Instructions</p>
              <ul className="text-[#92400e] text-xs space-y-1 list-disc list-inside">
                <li>Each question carries 1 mark. No negative marking.</li>
                <li>Timer starts once you click "Start Quiz".</li>
                <li>You can navigate between questions freely.</li>
                <li>Quiz auto-submits when timer runs out.</li>
                <li>You cannot attempt this quiz again once submitted.</li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0f2d5a, #1d4ed8)" }}
            >
              Start Quiz <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── TAKING QUIZ ──
  if (screen === "taking-quiz" && currentQuiz) {
    const q = currentQuiz.questions[currentQ];
    const isLow = timeLeft < 60;

    return (
      <div className="space-y-4">
        {/* Timer bar */}
        <div
          className="sticky top-0 z-10 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
          style={{ background: isLow ? "#fef2f2" : "#0f2d5a", border: isLow ? "1px solid #fecaca" : "none" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: isLow ? "#dc2626" : "#94a3b8" }}>
              {currentQuiz.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/10 px-2 py-1 rounded-lg" style={{ color: isLow ? "#7f1d1d" : "#94a3b8" }}>
              {answered}/{currentQuiz.questions.length} answered
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" style={{ color: isLow ? "#dc2626" : "#60a5fa" }} />
              <span
                className="font-mono font-bold text-sm"
                style={{ color: isLow ? "#dc2626" : "#ffffff" }}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="bg-white rounded-xl border border-[#e4ecf8] p-3 shadow-sm">
          <div className="flex flex-wrap gap-1.5">
            {currentQuiz.questions.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentQ(i)}
                className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: i === currentQ
                    ? "linear-gradient(135deg, #0f2d5a, #1d4ed8)"
                    : selectedAnswers[i] !== -1
                    ? "#dcfce7"
                    : "#f5f8fc",
                  color: i === currentQ ? "#fff" : selectedAnswers[i] !== -1 ? "#15803d" : "#52677e",
                  border: i === currentQ ? "none" : "1px solid #e4ecf8",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-[#e4ecf8] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#e4ecf8] text-[#0f2d5a] text-xs font-bold px-2.5 py-1 rounded-full font-mono">
              Q{currentQ + 1}/{currentQuiz.questions.length}
            </span>
            <span className="text-[#52677e] text-xs">1 mark</span>
          </div>
          <p className="text-[#0f1d2e] font-semibold leading-relaxed mb-4">{q.question}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const selected = selectedAnswers[currentQ] === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectAnswer(i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
                  style={{
                    background: selected ? "#eff6ff" : "#f8fafc",
                    border: selected ? "2px solid #1d4ed8" : "2px solid #e4ecf8",
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition"
                    style={{
                      background: selected ? "#1d4ed8" : "#e4ecf8",
                      color: selected ? "#fff" : "#52677e",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium" style={{ color: selected ? "#1d4ed8" : "#0f1d2e" }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nav */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="flex-1 py-3 rounded-xl border-2 border-[#e4ecf8] text-sm font-semibold text-[#52677e] hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          {currentQ < currentQuiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0f2d5a, #1d4ed8)" }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
            >
              Submit Quiz ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  if (screen === "result" && lastResult && currentQuiz) {
    const scorePct = Math.round((lastResult.score / lastResult.totalMarks) * 100);
    const isPass = scorePct >= 50;
    const isExcellent = scorePct >= 80;
    const resultColor = isExcellent ? "#16a34a" : isPass ? "#d97706" : "#dc2626";
    const resultBg = isExcellent ? "linear-gradient(135deg, #14532d, #16a34a)" : isPass ? "linear-gradient(135deg, #78350f, #d97706)" : "linear-gradient(135deg, #7f1d1d, #dc2626)";
    const grade = scorePct >= 90 ? "A+" : scorePct >= 80 ? "A" : scorePct >= 70 ? "B" : scorePct >= 60 ? "C" : scorePct >= 50 ? "D" : "F";

    return (
      <div className="space-y-5">
        <div className="rounded-2xl p-6 text-white text-center shadow-lg" style={{ background: resultBg }}>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-black">{grade}</span>
          </div>
          <p className="text-white/80 text-sm mb-1">Your Score</p>
          <p className="text-5xl font-black mb-0.5">{lastResult.score}<span className="text-2xl text-white/60">/{lastResult.totalMarks}</span></p>
          <p className="text-white/70 text-sm">{scorePct}% · {isExcellent ? "Excellent!" : isPass ? "Pass" : "Needs improvement"}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e4ecf8] shadow-sm p-5">
          <h3 className="font-bold text-[#0f1d2e] mb-3">{currentQuiz.title}</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Correct", value: lastResult.score, color: "#16a34a" },
              { label: "Wrong", value: lastResult.totalMarks - lastResult.score, color: "#dc2626" },
              { label: "Time Taken", value: `${lastResult.timeTaken} min`, color: "#1d4ed8" },
              { label: "Grade", value: grade, color: resultColor },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 bg-[#f5f8fc] rounded-xl">
                <p className="text-[#52677e] text-xs mb-1">{label}</p>
                <p className="font-bold text-lg" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Answer review */}
        <div className="bg-white rounded-2xl border border-[#e4ecf8] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#eef2f7]">
            <h3 className="font-semibold text-[#0f1d2e] text-sm">Answer Review</h3>
          </div>
          <div className="divide-y divide-[#f5f8fc]">
            {currentQuiz.questions.map((q, i) => {
              const userAns = lastResult.answers[i];
              const correct = userAns === q.correctIndex;
              return (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-start gap-2 mb-2">
                    {correct
                      ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    }
                    <p className="text-[#0f1d2e] text-sm font-medium flex-1">{q.question}</p>
                  </div>
                  {!correct && userAns !== -1 && (
                    <p className="text-red-500 text-xs ml-6">Your answer: {q.options[userAns]}</p>
                  )}
                  {!correct && (
                    <p className="text-green-600 text-xs ml-6 font-medium">Correct: {q.options[q.correctIndex]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => { setScreen("home"); setCurrentQuiz(null); setCode(""); }}
          className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0f2d5a, #1d4ed8)" }}
        >
          <RotateCcw className="w-4 h-4" /> Back to Quiz Portal
        </button>
      </div>
    );
  }

  // ── ATTEMPT REVIEW ──
  if (screen === "attempt-review" && reviewAttempt) {
    const quiz = availableQuizzes[reviewAttempt.quizCode];
    const scorePct = Math.round((reviewAttempt.score / reviewAttempt.totalMarks) * 100);
    return (
      <div className="space-y-5">
        <button onClick={() => setScreen("home")} className="text-[#1d4ed8] text-sm flex items-center gap-1 hover:underline">
          ← Back
        </button>
        <div className="bg-white rounded-2xl border border-[#e4ecf8] shadow-sm p-5">
          <h2 className="font-bold text-[#0f1d2e] text-lg">{reviewAttempt.quizTitle}</h2>
          <p className="text-[#52677e] text-sm mb-4">{reviewAttempt.subject} · Attempted on {reviewAttempt.attemptedAt}</p>
          <div className="grid grid-cols-3 gap-3 mb-0">
            <div className="p-3 bg-[#f5f8fc] rounded-xl text-center">
              <p className="text-green-600 font-bold text-xl">{reviewAttempt.score}</p>
              <p className="text-[#52677e] text-xs">Correct</p>
            </div>
            <div className="p-3 bg-[#f5f8fc] rounded-xl text-center">
              <p className="text-red-500 font-bold text-xl">{reviewAttempt.totalMarks - reviewAttempt.score}</p>
              <p className="text-[#52677e] text-xs">Wrong</p>
            </div>
            <div className="p-3 bg-[#f5f8fc] rounded-xl text-center">
              <p className="text-[#1d4ed8] font-bold text-xl">{scorePct}%</p>
              <p className="text-[#52677e] text-xs">Score</p>
            </div>
          </div>
        </div>
        {quiz && (
          <div className="bg-white rounded-2xl border border-[#e4ecf8] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#eef2f7]">
              <h3 className="font-semibold text-[#0f1d2e] text-sm">Answer Review</h3>
            </div>
            <div className="divide-y divide-[#f5f8fc]">
              {quiz.questions.map((q, i) => {
                const userAns = reviewAttempt.answers[i];
                const correct = userAns === q.correctIndex;
                return (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start gap-2 mb-1.5">
                      {correct
                        ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                      <p className="text-[#0f1d2e] text-sm font-medium flex-1">{q.question}</p>
                    </div>
                    {!correct && userAns !== -1 && (
                      <p className="text-red-500 text-xs ml-6">Your answer: {q.options[userAns]}</p>
                    )}
                    {!correct && (
                      <p className="text-green-600 text-xs ml-6 font-medium">Correct: {q.options[q.correctIndex]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
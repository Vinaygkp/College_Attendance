import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Calendar, User, Clock } from "lucide-react";
import { Subject, getAttendancePercent, classesNeededFor75, canBunkClasses } from "./attendanceData";

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

export function SubjectCard({ subject, index }: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const percent = getAttendancePercent(subject.attendedClasses, subject.totalClasses);
  const needed = classesNeededFor75(subject.attendedClasses, subject.totalClasses);
  const canBunk = canBunkClasses(subject.attendedClasses, subject.totalClasses);
  const isCritical = percent < 60;
  const isLow = percent < 75;

  const barColor = isCritical ? "#dc2626" : isLow ? "#f59e0b" : "#16a34a";
  const statusLabel = isCritical ? "Critical" : isLow ? "Low" : "Good";
  const statusBg = isCritical ? "#fee2e2" : isLow ? "#fef3c7" : "#dcfce7";
  const statusColor = isCritical ? "#dc2626" : isLow ? "#92400e" : "#15803d";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 shadow-sm mb-4"
      style={{
        background: "#ffffff",
        border: `1.5px solid ${isCritical ? "#fca5a5" : isLow ? "#fde68a" : "#e4ecf8"}`,
      }}
    >
      {/* Top accent stripe */}
      <div className="h-1" style={{ background: barColor }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-white font-black text-sm"
              style={{ background: "linear-gradient(135deg, #0f2d5a, #1d4ed8)" }}
            >
              {index + 1}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[#0f1d2e] font-bold text-sm leading-snug">{subject.name}</p>
              <p className="text-[#52677e] text-xs mt-0.5 font-mono">{subject.code}</p>
            </div>
          </div>
          <span className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: statusBg, color: statusColor }}>
            {statusLabel}
          </span>
        </div>

        {/* Attendance bar */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[#52677e] text-xs font-medium">Attendance Progress</span>
            <span className="font-black text-xl leading-none" style={{ color: barColor }}>{percent}%</span>
          </div>
          <div className="h-3 rounded-full bg-[#eef2f7] overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${barColor}cc, ${barColor})` }}
            />
            {/* 75% marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-[#64748b]/40" style={{ left: "75%" }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs">
            <span className="text-[#52677e]">{subject.attendedClasses} attended</span>
            <span className="text-[#94a3b8]">75% mark</span>
            <span className="text-[#52677e]">{subject.totalClasses} total</span>
          </div>
        </div>

        {/* Smart insight */}
        {isLow ? (
          <div
            className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-medium"
            style={{ background: isCritical ? "#fef2f2" : "#fffbeb", border: `1px solid ${isCritical ? "#fecaca" : "#fde68a"}` }}
          >
            <span className="text-base leading-none mt-0.5">{isCritical ? "🚨" : "⚠️"}</span>
            <span style={{ color: isCritical ? "#991b1b" : "#92400e" }}>
              Attend <strong>{needed} more class{needed !== 1 ? "es" : ""}</strong> consecutively to reach 75% threshold
            </span>
          </div>
        ) : canBunk > 0 ? (
          <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-medium" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <span className="text-base leading-none mt-0.5">✅</span>
            <span className="text-[#15803d]">
              Can skip <strong>{canBunk} more class{canBunk !== 1 ? "es" : ""}</strong> while staying above 75%
            </span>
          </div>
        ) : null}

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-[#52677e]">
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-[#94a3b8]" />{subject.faculty}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#94a3b8]" />{subject.schedule}
          </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold transition-colors hover:bg-[#f8fafc]"
        style={{ borderTop: "1px solid #eef2f7", color: "#1d4ed8" }}
      >
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {expanded ? "Hide Attendance Log" : "View Attendance Log"}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Log Section (With custom scroll max-height for high class counts) */}
      {expanded && subject.records && (
        <div className="px-5 pb-5 pt-3 max-h-56 overflow-y-auto" style={{ borderTop: "1px solid #eef2f7" }}>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
            {subject.records.map((r, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs"
                style={{
                  background: r.status === "present" ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${r.status === "present" ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                {r.status === "present"
                  ? <CheckCircle className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
                  : <XCircle className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
                }
                <span className="font-mono text-[10px]" style={{ color: r.status === "present" ? "#15803d" : "#dc2626" }}>
                  {r.date && r.date.includes("-") ? r.date.split("-").slice(1).join("/") : r.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
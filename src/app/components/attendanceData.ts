export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "holiday" | "cancelled";
}

export interface Subject {
  code: string;
  name: string;
  faculty: string;
  totalClasses: number;
  attendedClasses: number;
  schedule: string;
  records: AttendanceRecord[];
}

export interface Student {
  id: string;
  name: string;
  branch: string;
  semester: string;
  section: string;
  rollNo: string;
  email: string;
  phone: string;
  subjects: Subject[];
}

const generateRecords = (total: number, attended: number): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  let presentCount = 0;
  let absentCount = 0;
  const targetAbsent = total - attended;

  for (let m = 0; m < months.length; m++) {
    const daysInMonth = 5;
    for (let d = 1; d <= daysInMonth; d++) {
      if (presentCount + absentCount >= total) break;
      const day = d * 3;
      const date = `${months[m]}-${String(day).padStart(2, "0")}`;
      const remaining = total - presentCount - absentCount;
      const remainingAbsent = targetAbsent - absentCount;
      const shouldAbsent = remainingAbsent > 0 && Math.random() < remainingAbsent / remaining;
      if (shouldAbsent) {
        records.push({ date, status: "absent" });
        absentCount++;
      } else {
        records.push({ date, status: "present" });
        presentCount++;
      }
    }
  }
  return records;
};

export const studentsData: Record<string, Student> = {
  "2024B0311103": {
    id: "2024B0311103",
    rollNo: "2024B0311103",
    name: "Vinay Kumar",
    branch: "Electronic & Communication Engineering",
    semester: "5th Semester",
    section: "B",
    email: "vinay.24b0311103@abes.ac.in",
    phone: "+91 8601317580",
    subjects: [
      {
        code: "BCS401",
        name: "Web Development",
        faculty: "Dr. Priya Mehta",
        totalClasses: 45,
        attendedClasses: 38,
        schedule: "Mon, Wed, Fri — 9:00 AM",
        records: generateRecords(45, 38),
      },
      {
        code: "BCS402",
        name: "Compiler Design",
        faculty: "Prof. Anil Gupta",
        totalClasses: 42,
        attendedClasses: 28,
        schedule: "Tue, Thu — 10:00 AM",
        records: generateRecords(42, 28),
      },
      {
        code: "BCS403",
        name: "Operating Systems",
        faculty: "Dr. Saurabh Malik",
        totalClasses: 44,
        attendedClasses: 35,
        schedule: "Mon, Wed, Fri — 02:00 PM",
        records: generateRecords(44, 35),
      },
      {
        code: "BEC401",
        name: "Signal Processing",
        faculty: "Dr. Sunita Rao",
        totalClasses: 40,
        attendedClasses: 39,
        schedule: "Mon, Wed — 11:00 AM",
        records: generateRecords(40, 39),
      },
      {
        code: "BEC402",
        name: "VLSI Design",
        faculty: "Prof. Rakesh Joshi",
        totalClasses: 38,
        attendedClasses: 22,
        schedule: "Tue, Thu, Sat — 12:00 PM",
        records: generateRecords(38, 22),
      },
      {
        code: "KVE401",
        name: "Universal Human Values",
        faculty: "Prof. Sandeep Sharma",
        totalClasses: 30,
        attendedClasses: 26,
        schedule: "Fri, Sat — 03:30 PM",
        records: generateRecords(30, 26),
      },
    ],
  },
  "2024B0311104": {
    id: "2024B0311104",
    rollNo: "2024B0311104",
    name: "Rahul Singh",
    branch: "Computer Science & Engineering",
    semester: "5th Semester",
    section: "A",
    email: "rahul.singh@abes.ac.in",
    phone: "+91 9765432109",
    subjects: [
      {
        code: "BCS401",
        name: "Web Development",
        faculty: "Dr. Priya Mehta",
        totalClasses: 45,
        attendedClasses: 43,
        schedule: "Mon, Wed, Fri — 9:00 AM",
        records: generateRecords(45, 43),
      },
      {
        code: "BCS402",
        name: "Compiler Design",
        faculty: "Prof. Anil Gupta",
        totalClasses: 42,
        attendedClasses: 40,
        schedule: "Tue, Thu — 10:00 AM",
        records: generateRecords(42, 40),
      },
      {
        code: "BCS403",
        name: "Operating Systems",
        faculty: "Dr. Saurabh Malik",
        totalClasses: 44,
        attendedClasses: 41,
        schedule: "Mon, Wed, Fri — 02:00 PM",
        records: generateRecords(44, 41),
      },
      {
        code: "BEC401",
        name: "Signal Processing",
        faculty: "Dr. Sunita Rao",
        totalClasses: 40,
        attendedClasses: 36,
        schedule: "Mon, Wed — 11:00 AM",
        records: generateRecords(40, 36),
      },
      {
        code: "BEC402",
        name: "VLSI Design",
        faculty: "Prof. Rakesh Joshi",
        totalClasses: 38,
        attendedClasses: 35,
        schedule: "Tue, Thu, Sat — 12:00 PM",
        records: generateRecords(38, 35),
      },
      {
        code: "KVE401",
        name: "Universal Human Values",
        faculty: "Prof. Sandeep Sharma",
        totalClasses: 30,
        attendedClasses: 28,
        schedule: "Fri, Sat — 03:30 PM",
        records: generateRecords(30, 28),
      },
    ],
  },
};

export function getAttendancePercent(attended: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100);
}

export function classesNeededFor75(attended: number, total: number): number {
  if (getAttendancePercent(attended, total) >= 75) return 0;
  return Math.ceil((0.75 * total - attended) / 0.25);
}

export function canBunkClasses(attended: number, total: number): number {
  const excess = attended - 0.75 * total;
  if (excess <= 0) return 0;
  return Math.floor(excess / 0.75);
}

/**
 * ── OVERALL ATTENDANCE PREDICTOR MATH ──
 */
export function overallClassesNeededFor75(totalAttended: number, totalClasses: number): number {
  if (totalClasses === 0) return 0;
  if (getAttendancePercent(totalAttended, totalClasses) >= 75) return 0;
  return Math.ceil((0.75 * totalClasses - totalAttended) / 0.25);
}

export function overallCanBunkClasses(totalAttended: number, totalClasses: number): number {
  if (totalClasses === 0) return 0;
  const excess = totalAttended - 0.75 * totalClasses;
  if (excess <= 0) return 0;
  return Math.floor(excess / 0.75);
}

/**
 * ── ATTENDANCE ADDER FUNCTION ──
 */
export function addAttendanceRecord(
  student: Student,
  subjectCode: string,
  status: "present" | "absent" | "holiday" | "cancelled"
): Student {
  const updatedSubjects = student.subjects.map((sub) => {
    if (sub.code === subjectCode) {
      const today = new Date().toISOString().slice(0, 10);
      
      const isDuplicate = sub.records.some((rec) => rec.date === today);
      if (isDuplicate) return sub;

      const isPresent = status === "present";
      const isAbsent = status === "absent";

      return {
        ...sub,
        totalClasses: sub.totalClasses + (isPresent || isAbsent ? 1 : 0),
        attendedClasses: sub.attendedClasses + (isPresent ? 1 : 0),
        records: [
          { date: today, status },
          ...sub.records,
        ],
      };
    }
    return sub;
  });

  return {
    ...student,
    subjects: updatedSubjects,
  };
}
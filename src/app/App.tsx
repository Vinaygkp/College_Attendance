import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { studentsData } from "./components/attendanceData";

const fallbackStudent = {
  id: "STU001",
  rollNo: "2024B0311103",
  name: "Vinay Kumar",
  branch: "Electronic & Communication Engineering",
  semester: "5th Semester",
  section: "B",
  email: "vinay.24b0311103@abes.ac.in",
  phone: "+91 8601317580",
  subjects: [
    { code: "BCS401", name: "Web Development", attendedClasses: 34, totalClasses: 40 },
    { code: "BCS402", name: "Compiler Design", attendedClasses: 26, totalClasses: 40 },
    { code: "BCS403", name: "Signal Processing", attendedClasses: 31, totalClasses: 40 },
    { code: "BCS404", name: "VLSI Design", attendedClasses: 22, totalClasses: 40 },
  ],
};

export default function App() {
  // ── 🔄 REFRESH PROOF INITIALIZATION ──
  // App load hote hi sabse pehle localStorage se loggedInId dhoondega
  const [loggedInId, setLoggedInId] = useState<string | null>(() => {
    return localStorage.getItem("aims_loggedInId");
  });

  // Handle Login: State me save karne ke sath local storage me bhi copy karega
  const handleLogin = (id: string) => {
    setLoggedInId(id);
    localStorage.setItem("aims_loggedInId", id);
  };

  // Handle Logout: State ko null karega aur local storage se clear karega
  const handleLogout = () => {
    setLoggedInId(null);
    localStorage.removeItem("aims_loggedInId");
  };

  const student = loggedInId 
    ? (studentsData[loggedInId] || { ...fallbackStudent, rollNo: loggedInId }) 
    : null;

  return (
    <>
      {!student ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard student={student} onLogout={handleLogout} />
      )}
    </>
  );
}
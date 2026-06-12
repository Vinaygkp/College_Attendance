export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  code: string; // Strictly max 5 characters alphanumeric
  title: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  duration: number; // minutes
  totalMarks: number;
  questions: QuizQuestion[];
  expiresAt: string;
}

export interface QuizAttempt {
  quizCode: string;
  quizTitle: string;
  subject: string;
  attemptedAt: string;
  score: number;
  totalMarks: number;
  timeTaken: number; // minutes
  answers: number[];
}

// All quiz codes are now strictly 5 characters long
export const availableQuizzes: Record<string, Quiz> = {
  "OS401": {
    code: "OS401",
    title: "Unit 2 — Process Management",
    subject: "Operating Systems",
    subjectCode: "BCS402", // Aligned with BCS402 Compiler/OS structures
    faculty: "Dr. Priya Mehta",
    duration: 15,
    totalMarks: 10,
    expiresAt: "2026-07-15",
    questions: [
      {
        id: 1,
        question: "Which scheduling algorithm gives minimum average waiting time for a given set of processes?",
        options: ["FCFS", "SJF", "Round Robin", "Priority Scheduling"],
        correctIndex: 1,
      },
      {
        id: 2,
        question: "A process is in the 'waiting' state when it is:",
        options: [
          "Being executed by the CPU",
          "Waiting for I/O or an event to complete",
          "Ready to run but not yet assigned CPU",
          "Terminated",
        ],
        correctIndex: 1,
      },
      {
        id: 3,
        question: "Deadlock can be prevented by:",
        options: [
          "Allowing circular wait",
          "Allowing processes to hold resources indefinitely",
          "Ensuring at least one of the four Coffman conditions is never satisfied",
          "Running only one process at a time",
        ],
        correctIndex: 2,
      },
      {
        id: 4,
        question: "Which of the following is NOT a necessary condition for deadlock?",
        options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"],
        correctIndex: 2,
      },
      {
        id: 5,
        question: "In Round Robin scheduling, if the time quantum is very large, it behaves like:",
        options: ["SJF", "FCFS", "LIFO", "Multilevel Queue"],
        correctIndex: 1,
      },
      {
        id: 6,
        question: "The PCB (Process Control Block) does NOT contain:",
        options: ["Process state", "Program counter", "Source code of process", "CPU registers"],
        correctIndex: 2,
      },
      {
        id: 7,
        question: "Context switching overhead is caused by:",
        options: [
          "Saving and loading process state",
          "Running processes faster",
          "Reducing memory usage",
          "Allocating I/O devices",
        ],
        correctIndex: 0,
      },
      {
        id: 8,
        question: "Which system call creates a new process in Unix/Linux?",
        options: ["create()", "exec()", "fork()", "spawn()"],
        correctIndex: 2,
      },
      {
        id: 9,
        question: "Banker's Algorithm is used for:",
        options: ["Memory allocation", "Deadlock avoidance", "CPU scheduling", "File management"],
        correctIndex: 1,
      },
      {
        id: 10,
        question: "A thread is different from a process because threads:",
        options: [
          "Have their own memory space",
          "Share the same memory space of the parent process",
          "Cannot communicate with each other",
          "Run on separate CPUs only",
        ],
        correctIndex: 1,
      },
    ],
  },
  "DB401": {
    code: "DB401",
    title: "Unit 1 — ER Model & Relational Algebra",
    subject: "Database Management Systems",
    subjectCode: "BCS401", // Aligned with BCS401 Web Dev/DBMS portal schema
    faculty: "Prof. Anil Gupta",
    duration: 20,
    totalMarks: 10,
    expiresAt: "2026-07-20",
    questions: [
      {
        id: 1,
        question: "Which of the following is a DDL command?",
        options: ["SELECT", "INSERT", "CREATE", "UPDATE"],
        correctIndex: 2,
      },
      {
        id: 2,
        question: "In an ER diagram, a weak entity set is identified by a:",
        options: ["Rectangle", "Double rectangle", "Diamond", "Ellipse"],
        correctIndex: 1,
      },
      {
        id: 3,
        question: "Which normal form removes transitive dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctIndex: 2,
      },
      {
        id: 4,
        question: "The SELECT operation in relational algebra is denoted by:",
        options: ["π", "σ", "⨝", "∪"],
        correctIndex: 1,
      },
      {
        id: 5,
        question: "ACID stands for:",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Access, Control, Integrity, Data",
          "Aggregation, Concurrency, Index, Distribution",
          "Authorization, Consistency, Integrity, Dependency",
        ],
        correctIndex: 0,
      },
      {
        id: 6,
        question: "Which join returns all records from both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
        correctIndex: 3,
      },
      {
        id: 7,
        question: "A foreign key constraint ensures:",
        options: [
          "Uniqueness of a column",
          "Referential integrity between two tables",
          "Values are not null",
          "All rows are unique",
        ],
        correctIndex: 1,
      },
      {
        id: 8,
        question: "Which of the following is used to remove duplicate rows in SQL?",
        options: ["UNIQUE", "DISTINCT", "NOT NULL", "PRIMARY KEY"],
        correctIndex: 1,
      },
      {
        id: 9,
        question: "An index in a database is used to:",
        options: [
          "Reduce storage space",
          "Speed up data retrieval",
          "Enforce constraints",
          "Manage transactions",
        ],
        correctIndex: 1,
      },
      {
        id: 10,
        question: "Which SQL clause filters groups after aggregation?",
        options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
        correctIndex: 2,
      },
    ],
  },
  "SP401": {
    code: "SP401",
    title: "Unit 1 — Signal Properties",
    subject: "Signal Processing",
    subjectCode: "BEC401",
    faculty: "Dr. Sunita Rao",
    duration: 15,
    totalMarks: 10,
    expiresAt: "2026-07-18",
    questions: [
      {
        id: 1,
        question: "Convolution in the time domain corresponds to __ in the frequency domain:",
        options: ["Convolution", "Addition", "Multiplication", "Division"],
        correctIndex: 2,
      },
      {
        id: 2,
        question: "A causal system is one where the output depends on:",
        options: [
          "Future inputs only",
          "Past and present inputs only",
          "Future and present inputs",
          "No inputs",
        ],
        correctIndex: 1,
      },
    ],
  },
  "VL401": {
    code: "VL401",
    title: "Unit 2 — DFT & FFT",
    subject: "VLSI Design",
    subjectCode: "BEC402",
    faculty: "Prof. Rakesh Joshi",
    duration: 15,
    totalMarks: 10,
    expiresAt: "2026-07-22",
    questions: [
      {
        id: 1,
        question: "The FFT algorithm reduces DFT computation from O(N²) to:",
        options: ["O(N)", "O(N log N)", "O(log N)", "O(N²/2)"],
        correctIndex: 1,
      },
      {
        id: 2,
        question: "Aliasing occurs when the sampling rate is:",
        options: [
          "Greater than twice the signal frequency",
          "Equal to the signal frequency",
          "Less than twice the signal frequency",
          "Exactly twice the signal frequency",
        ],
        correctIndex: 2,
      },
    ],
  },
};

// Aligned with the exact 5 character mapping
export const subjectQuizMap: Record<string, string[]> = {
  BCS402: ["OS401"],
  BCS401: ["DB401"],
  BEC401: ["SP401"],
  BEC402: ["VL401"],
};
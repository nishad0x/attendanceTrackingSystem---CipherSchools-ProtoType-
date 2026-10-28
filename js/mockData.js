/**
 * CipherTrack by CipherSchools - Mock Data Store
 * Multi-University Partner Configuration & 20 Deployed Mentors Dataset
 */

const UNIVERSITY_PROFILES = {
  lpu: {
    id: "lpu",
    name: "Lovely Professional University",
    shortName: "LPU",
    location: "Phagwara, Punjab",
    logo: "assets/lpu-logo.svg",
    subtitle: "On-Campus Academic Operations • 20 Mentors",
    leadContact: "Dr. S. K. Sen (Dean of Academic Operations)"
  },
  cu: {
    id: "cu",
    name: "Chandigarh University",
    shortName: "CU",
    location: "Mohali, Punjab",
    logo: "assets/cu-logo.png",
    subtitle: "University Academic Operations • 20 Mentors",
    leadContact: "Prof. R. S. Bawa (Director of Academic Affairs)"
  },
  chitkara: {
    id: "chitkara",
    name: "Chitkara University",
    shortName: "Chitkara",
    location: "Rajpura, Punjab",
    logo: "assets/chitkara-logo.svg",
    subtitle: "Academic Operations Desk • 20 Mentors",
    leadContact: "Dr. Sandeep Arora (Academic Dean)"
  },
  thapar: {
    id: "thapar",
    name: "Thapar Institute of Engg & Tech",
    shortName: "Thapar",
    location: "Patiala, Punjab",
    logo: "assets/thapar-logo.svg",
    subtitle: "Engineering Mentorship Desk • 20 Mentors",
    leadContact: "Dr. Ajay Batish (Dean of Academics)"
  }
};

const INITIAL_MENTORS_DATA = [
  {
    id: "MTR-101",
    name: "Dr. Aarav Sharma",
    dept: "Data Science & AI",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 34, AI Lab 301",
    checkIn: "09:05 AM",
    checkOut: "17:15 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.16,
    avatar: "AS",
    phone: "+91 98201 44101",
    evidence: "Manual university sign-in sheet matching classroom roll call."
  },
  {
    id: "MTR-102",
    name: "Priya Nair",
    dept: "Full Stack Web",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 34, Web Lab 402",
    checkIn: "09:12 AM",
    checkOut: "--:--",
    source: "Manual Entry",
    status: "missing_out",
    effectiveHours: 0,
    avatar: "PN",
    phone: "+91 98201 44102",
    evidence: "Signed morning register at 09:12 AM; omitted evening checkout column."
  },
  {
    id: "MTR-103",
    name: "Rohan Varma",
    dept: "Cloud Computing",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 36, Cloud Lab 2",
    checkIn: "09:45 AM",
    checkOut: "17:05 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 7.34,
    avatar: "RV",
    phone: "+91 98201 44103",
    evidence: "Arrived at 09:45 AM (15 mins after class start). Highway transit delay noted."
  },
  {
    id: "MTR-104",
    name: "Ananya Iyer",
    dept: "Cybersecurity",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 28, Security Lab 101",
    checkIn: "--:--",
    checkOut: "17:10 PM",
    source: "Manual Entry",
    status: "missing_in",
    effectiveHours: 0,
    avatar: "AI",
    phone: "+91 98201 44104",
    evidence: "Conducted 09:30 AM session in Block 28; forgot to log entry on attendance sheet."
  },
  {
    id: "MTR-105",
    name: "Vikramaditya Das",
    dept: "DevOps & SRE",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 36, Server Arch Lab",
    checkIn: "08:55 AM",
    checkOut: "17:05 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.17,
    avatar: "VD",
    phone: "+91 98201 44105",
    evidence: "Clean manual roster entry with university coordinator verification."
  },
  {
    id: "MTR-106",
    name: "Sneha Mukherjee",
    dept: "Mobile Development",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 32, Android Studio Lab",
    checkIn: "--:--",
    checkOut: "--:--",
    source: "Pending Entry",
    status: "absent",
    effectiveHours: 0,
    avatar: "SM",
    phone: "+91 98201 44106",
    evidence: "Zero entries on university sign-in sheet today. No leave submitted."
  },
  {
    id: "MTR-107",
    name: "Karthik Sundaram",
    dept: "Machine Learning",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 34, Data Mining Lab 1",
    checkIn: "09:01 AM",
    checkOut: "16:15 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 7.23,
    avatar: "KS",
    phone: "+91 98201 44107",
    evidence: "Left campus at 16:15 PM with prior coordinator intimation."
  },
  {
    id: "MTR-108",
    name: "Neha Choudhury",
    dept: "UI/UX Design",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 38, Design Studio 102",
    checkIn: "08:58 AM",
    checkOut: "17:20 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.36,
    avatar: "NC",
    phone: "+91 98201 44108",
    evidence: "Logged and countersigned by university faculty head."
  },
  {
    id: "MTR-109",
    name: "Aditya Patel",
    dept: "Product Management",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Uni-Mall Block, Seminar Hall 3",
    checkIn: "09:18 AM",
    checkOut: "--:--",
    source: "Manual Entry",
    status: "missing_out",
    effectiveHours: 0,
    avatar: "AP",
    phone: "+91 98201 44109",
    evidence: "Conducted PM capstone session; missed evening sign-out."
  },
  {
    id: "MTR-110",
    name: "Meera Kulkarni",
    dept: "Business Analytics",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 14, Analytics Lab B",
    checkIn: "09:04 AM",
    checkOut: "17:08 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.07,
    avatar: "MK",
    phone: "+91 98201 44110",
    evidence: "Verified with departmental roster."
  },
  {
    id: "MTR-111",
    name: "Tanmay Joshi",
    dept: "Blockchain & Web3",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 34, Fintech Lab 5",
    checkIn: "09:00 AM",
    checkOut: "--:--",
    source: "Manual Entry",
    status: "missing_out",
    effectiveHours: 0,
    avatar: "TJ",
    phone: "+91 98201 44111",
    evidence: "Entered at 09:00 AM for Web3 contract session; checkout pending."
  },
  {
    id: "MTR-112",
    name: "Divya Menon",
    dept: "Data Engineering",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 36, Distributed Lab",
    checkIn: "08:50 AM",
    checkOut: "17:02 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.19,
    avatar: "DM",
    phone: "+91 98201 44112",
    evidence: "Verified complete shift attendance."
  },
  {
    id: "MTR-113",
    name: "Siddharth Rao",
    dept: "Quality Engineering",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 32, QA Automation Lab",
    checkIn: "09:38 AM",
    checkOut: "17:30 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 7.87,
    avatar: "SR",
    phone: "+91 98201 44113",
    evidence: "Punched in at 09:38 AM (8 mins after 09:30 AM class). Compensated after 17:00."
  },
  {
    id: "MTR-114",
    name: "Pooja Hegde",
    dept: "Soft Skills & Placement",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 25, Lecture Theatre 1",
    checkIn: "08:52 AM",
    checkOut: "17:00 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.14,
    avatar: "PH",
    phone: "+91 98201 44114",
    evidence: "Full attendance verified."
  },
  {
    id: "MTR-115",
    name: "Manish Tiwari",
    dept: "Embedded Systems",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 29, Microcontroller Lab",
    checkIn: "--:--",
    checkOut: "17:05 PM",
    source: "Manual Entry",
    status: "missing_in",
    effectiveHours: 0,
    avatar: "MT",
    phone: "+91 98201 44115",
    evidence: "Conducted robotics session; morning sheet entry missing."
  },
  {
    id: "MTR-116",
    name: "Ishita Sen",
    dept: "Fintech & Quant",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 14, Economics Lab",
    checkIn: "09:08 AM",
    checkOut: "17:15 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.11,
    avatar: "IS",
    phone: "+91 98201 44116",
    evidence: "Full attendance logged on imported sheet."
  },
  {
    id: "MTR-117",
    name: "Gaurav Bhatia",
    dept: "Enterprise Java",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 34, Java Lab 203",
    checkIn: "09:02 AM",
    checkOut: "--:--",
    source: "Manual Entry",
    status: "missing_out",
    effectiveHours: 0,
    avatar: "GB",
    phone: "+91 98201 44117",
    evidence: "Conducted Spring Boot sprint review till 17:00 PM; forgot sign-out."
  },
  {
    id: "MTR-118",
    name: "Ritika Malhotra",
    dept: "Algorithm Design",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 36, Algorithms Lab 105",
    checkIn: "08:59 AM",
    checkOut: "17:00 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.01,
    avatar: "RM",
    phone: "+91 98201 44118",
    evidence: "Full day attendance verified."
  },
  {
    id: "MTR-119",
    name: "Harish Nambiar",
    dept: "Database Systems",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 34, SQL Lab 304",
    checkIn: "09:50 AM",
    checkOut: "16:40 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 6.83,
    avatar: "HN",
    phone: "+91 98201 44119",
    evidence: "Late arrival (09:50 AM > 09:30 AM) and left at 16:40 PM."
  },
  {
    id: "MTR-120",
    name: "Swati Deshmukh",
    dept: "Technical Communication",
    assignedShift: "09:00 - 17:00",
    scheduledClassTime: "09:30 AM",
    classroom: "Block 18, Language Lab 102",
    checkIn: "08:54 AM",
    checkOut: "17:10 PM",
    source: "Imported Excel",
    status: "verified",
    effectiveHours: 8.27,
    avatar: "SD",
    phone: "+91 98201 44120",
    evidence: "Full day attendance verified."
  }
];

// Helper: Calculate Punctuality based on Scheduled Class Time (e.g., 09:30 AM)
function evaluatePunctuality(checkInTimeStr, scheduledTimeStr = "09:30 AM") {
  if (!checkInTimeStr || checkInTimeStr.includes("--")) {
    return {
      status: "missing",
      badgeClass: "pill-warning",
      label: "No Punch Recorded",
      diffMinutes: null
    };
  }

  function parseTimeToMinutes(tStr) {
    const parts = tStr.trim().split(" ");
    const timeParts = parts[0].split(":");
    let h = parseInt(timeParts[0], 10);
    const m = parseInt(timeParts[1], 10);
    const isPM = parts[1] && parts[1].toUpperCase() === "PM";
    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return h * 60 + m;
  }

  const checkInMin = parseTimeToMinutes(checkInTimeStr);
  const scheduledMin = parseTimeToMinutes(scheduledTimeStr);

  const diff = scheduledMin - checkInMin;

  if (diff >= 0) {
    return {
      status: "on_time",
      badgeClass: "pill-success",
      label: `✓ On Time (${diff}m before class)`,
      diffMinutes: diff
    };
  } else {
    const lateBy = Math.abs(diff);
    return {
      status: "late",
      badgeClass: "pill-danger",
      label: `⚠️ Late by ${lateBy}m (After ${scheduledTimeStr})`,
      diffMinutes: diff
    };
  }
}

// Initial Outgoing Reminders Dispatch History
const INITIAL_DISPATCH_LOGS = [
  {
    id: "DSP-101",
    time: "09:16 AM",
    mentorId: "MTR-106",
    mentorName: "Sneha Mukherjee",
    triggerType: "Pre-Class Check-In Reminder",
    channel: "WhatsApp + SMS",
    status: "Delivered",
    reply: "No response yet (Unreachable)"
  },
  {
    id: "DSP-102",
    time: "09:16 AM",
    mentorId: "MTR-104",
    mentorName: "Ananya Iyer",
    triggerType: "Pre-Class Check-In Reminder",
    channel: "WhatsApp",
    status: "Read",
    reply: "In Block 28, class started. Signing register now!"
  },
  {
    id: "DSP-103",
    time: "09:16 AM",
    mentorId: "MTR-115",
    mentorName: "Manish Tiwari",
    triggerType: "Pre-Class Check-In Reminder",
    channel: "WhatsApp",
    status: "Read",
    reply: "Reached directly to Microcontroller Lab in Block 29."
  },
  {
    id: "DSP-104",
    time: "09:40 AM",
    mentorId: "MTR-ALL",
    mentorName: "Coordinator Digest (Naveen Kumar)",
    triggerType: "Class Start Punctuality Digest",
    channel: "Slack + WhatsApp",
    status: "Delivered",
    reply: "Acknowledged by CipherSchools Campus Lead"
  },
  {
    id: "DSP-105",
    time: "16:45 PM",
    mentorId: "MTR-102",
    mentorName: "Priya Nair",
    triggerType: "Shift-End Sign-Out Advisory",
    channel: "WhatsApp",
    status: "Read",
    reply: "Will sign out at 17:00 PM on the desk sheet in Block 34"
  },
  {
    id: "DSP-106",
    time: "16:45 PM",
    mentorId: "MTR-111",
    mentorName: "Tanmay Joshi",
    triggerType: "Shift-End Sign-Out Advisory",
    channel: "WhatsApp",
    status: "Delivered",
    reply: "Understood, updating exit time"
  }
];

// Sample Excel Sheet Data for the Import Feature Demo
const SAMPLE_EXCEL_IMPORT_DATA = [
  { id: "MTR-101", name: "Dr. Aarav Sharma", dept: "Data Science & AI", scheduled: "09:30 AM", in: "09:05 AM", out: "17:15 PM", room: "Block 34, Lab 301" },
  { id: "MTR-102", name: "Priya Nair", dept: "Full Stack Web", scheduled: "09:30 AM", in: "09:12 AM", out: "17:00 PM", room: "Block 34, Lab 402" },
  { id: "MTR-103", name: "Rohan Varma", dept: "Cloud Computing", scheduled: "09:30 AM", in: "09:45 AM", out: "17:05 PM", room: "Block 36, Lab 2" },
  { id: "MTR-104", name: "Ananya Iyer", dept: "Cybersecurity", scheduled: "09:30 AM", in: "09:20 AM", out: "17:10 PM", room: "Block 28, Lab 101" },
  { id: "MTR-105", name: "Vikramaditya Das", dept: "DevOps & SRE", scheduled: "09:30 AM", in: "08:55 AM", out: "17:05 PM", room: "Block 36, Server Lab" },
  { id: "MTR-106", name: "Sneha Mukherjee", dept: "Mobile Development", scheduled: "09:30 AM", in: "09:15 AM", out: "17:00 PM", room: "Block 32, Android Lab" },
  { id: "MTR-107", name: "Karthik Sundaram", dept: "Machine Learning", scheduled: "09:30 AM", in: "09:01 AM", out: "16:30 PM", room: "Block 34, Mining Lab" },
  { id: "MTR-108", name: "Neha Choudhury", dept: "UI/UX Design", scheduled: "09:30 AM", in: "08:58 AM", out: "17:20 PM", room: "Block 38, Design Studio" },
  { id: "MTR-109", name: "Aditya Patel", dept: "Product Management", scheduled: "09:30 AM", in: "09:18 AM", out: "17:10 PM", room: "Uni-Mall, Hall 3" },
  { id: "MTR-110", name: "Meera Kulkarni", dept: "Business Analytics", scheduled: "09:30 AM", in: "09:04 AM", out: "17:08 PM", room: "Block 14, Analytics Lab" },
  { id: "MTR-111", name: "Tanmay Joshi", dept: "Blockchain & Web3", scheduled: "09:30 AM", in: "09:00 AM", out: "17:00 PM", room: "Block 34, Fintech Lab" },
  { id: "MTR-112", name: "Divya Menon", dept: "Data Engineering", scheduled: "09:30 AM", in: "08:50 AM", out: "17:02 PM", room: "Block 36, Distributed Lab" },
  { id: "MTR-113", name: "Siddharth Rao", dept: "Quality Engineering", scheduled: "09:30 AM", in: "09:25 AM", out: "17:30 PM", room: "Block 32, QA Lab" },
  { id: "MTR-114", name: "Pooja Hegde", dept: "Soft Skills & Placement", scheduled: "09:30 AM", in: "08:52 AM", out: "17:00 PM", room: "Block 25, Hall 1" },
  { id: "MTR-115", name: "Manish Tiwari", dept: "Embedded Systems", scheduled: "09:30 AM", in: "09:10 AM", out: "17:05 PM", room: "Block 29, Micro Lab" },
  { id: "MTR-116", name: "Ishita Sen", dept: "Fintech & Quant", scheduled: "09:30 AM", in: "09:08 AM", out: "17:15 PM", room: "Block 14, Econ Lab" },
  { id: "MTR-117", name: "Gaurav Bhatia", dept: "Enterprise Java", scheduled: "09:30 AM", in: "09:02 AM", out: "17:00 PM", room: "Block 34, Java Lab" },
  { id: "MTR-118", name: "Ritika Malhotra", dept: "Algorithm Design", scheduled: "09:30 AM", in: "08:59 AM", out: "17:00 PM", room: "Block 36, Algorithms Lab" },
  { id: "MTR-119", name: "Harish Nambiar", dept: "Database Systems", scheduled: "09:30 AM", in: "09:15 AM", out: "17:00 PM", room: "Block 34, SQL Lab" },
  { id: "MTR-120", name: "Swati Deshmukh", dept: "Technical Communication", scheduled: "09:30 AM", in: "08:54 AM", out: "17:10 PM", room: "Block 18, Language Lab" }
];

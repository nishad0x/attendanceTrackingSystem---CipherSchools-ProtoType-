# CipherTrack by CipherSchools — EdTech Mentor Attendance Governance Desk

> **University Operations & Attendance Reconciliation Platform**  
> *Built for CipherSchools Operational Coordinators overseeing 20 mentors deployed at university partner campus.*

---

## 🎯 The Operational Problem Solved

CipherSchools has deployed **20 mentors** to Lovely Professional University (LPU). Because attendance is not automated with biometric hardware machines:
- Attendance entries are recorded manually or imported via daily university Excel / CSV sheets.
- Mentors must be in their designated classrooms and punched in **before scheduled class start time (09:30 AM)**.
- Some mentors arrive after 09:30 AM, and some forget their afternoon / evening sign-out after class labs.
- This creates incomplete punch records, billing ambiguity, stipend uncertainties, and academic coordinator audit friction.

---

## 🚀 The 4 Integrated Solutions

### Solution 1: Daily Attendance Reconciliation
* **Excel Sheet vs Class Timetable Matrix**: Compares university sign-in sheet entries against scheduled class start times (09:30 AM) and shift exit times (17:00 PM).
* **One-Click Regularization**: Modal workflow allowing coordinators to resolve missing punches using student attendance records, classroom syllabus logs, or approved excuses.
* **Auto-Suggest Timetable Pairing**: Algorithmic engine that automatically matches incomplete morning/evening records with scheduled course timetables.
* **Immutable Coordinator Audit Trail**: Real-time log tracking every manual adjustment with coordinator signature for academic audit compliance.

### Solution 2: Automated Reminders & Alerts Dispatcher
* **Rule #1: 09:15 AM Pre-Class Entry Alert**: Detects missing check-ins 15 minutes before 09:30 AM class and alerts mentors via WhatsApp / SMS.
* **Rule #2: 16:45 PM Shift-End Sign-Out Safeguard**: Proactively reminds mentors in class labs 15 minutes before 17:00 PM to record their evening sign-out.
* **Rule #3: 09:40 AM Coordinator Punctuality Digest**: Automated morning digest detailing mentors who were late (after 09:30 AM) or absent.
* **Live WhatsApp Simulator**: Interactive phone mockup with two-way simulated replies.

### Solution 3: Exception Reporting & Audit Desk
* **Granular Discrepancy Registry**: Categorization of Late Arrivals (after 09:30 AM), Missing Check-Outs, Missing Check-Ins, Under-Hours, and Unreported Absences.
* **Direct Resolution Pipeline**: Change status from "Action Required" to "Reconciled".
* **One-Click CSV Export**: Downloads structured `.csv` records for payroll and operations.
* **Formal University Audit Document**: Clean, printable formal audit report with university header, verification stamp, and coordinator/dean sign-off blocks.

### Solution 4: Accountability Dashboard
* **Executive Operational KPIs**: Cohort Strength (20), Verified Complete, Critical Exceptions Count, **Class Punctuality Rate (% on-time before 09:30 AM)**, and Billing Risk (Uncertain hours).
* **Class Arrival Punctuality Flow**: Distribution visualizer comparing arrivals before 09:30 AM vs late arrivals.
* **20 Mentors Registry**: Displays Mentor ID, Department, **Scheduled Class Time**, **Actual Check-In**, **Class Punctuality Status (Before 09:30 AM)**, **Check-Out**, and Net Hours. *(30-day compliance column removed)*.

---

## 📥 Manual Entry & Excel Import Features

1. **Import Excel Sheet**: Drag-and-drop or select any `.xlsx` / `.csv` university attendance sheet, preview parsed rows, and update the cohort in one click.
2. **Log Manual Entry**: Add or edit individual mentor punch entries directly with class time, room, check-in, check-out, and verification notes.

---

## 🏃 Quick Start (How to Run)

Run a local server:
```powershell
python -m http.server 3000
```
Then visit: **`http://localhost:3000`** in your browser.

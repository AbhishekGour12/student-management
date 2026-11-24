# 🎓 EduManage Pro — Modern Student Management System

A sleek, feature-packed **Student Management System** web portal designed for college/university **1st Year Micro Projects**. Built using pure **HTML5, CSS3, and Modern JavaScript** with persistent client-side **localStorage** and zero external database dependencies.

---

## 🌟 Key Architecture & Highlights

### 1. Two-Panel Unified Architecture
* **🛡️ Admin / Faculty Portal (`admin-dashboard.html`)**:
  * **Fixed Admin Credentials**: Pre-configured as `admin@gmail.com` / `admin123`.
  * **Student Directory CRUD**: Add new students with full details (Name, Roll No, Email, Phone, Course [B.Tech, BCA, B.Com, BBA, B.Sc], Specialization [AI & ML, IoT, CSE, Cloud, Finance, Cyber Security], Semester, Gender, Status).
  * **Real-time Search & Multi-Filters**: Instant search by Name, Roll No, ID, Phone, or Email with multi-criteria dropdown filtering for Branch and Semester.
  * **Edit & Delete Operations**: Quick edit modal for student details and safe delete with confirmation and cascade cleanup.
  * **Subject-Wise Attendance Manager**: Visual circular progress ring, total lectures held vs. attended, 75% exam eligibility status, and quick `+ Present` / `- Absent` marking buttons.
  * **Marks & Grading Manager**: Record Internal (/30), Mid-Term (/40), and Final Exam (/50) marks. Automatic computation of total (/120), letter grades (`A+`, `A`, `B+`, `B`, `C`, `F`), and CGPA.
  * **Homework & Task Publisher**: Post homework assignments with subject, title, due date, description, and course degree.
  * **Notice & Announcement Board**: Publish college alerts (Exam Schedules, Hackathons, Important Notices) visible immediately on student dashboards.
  * **Academic Insights**: High-level analytics showing total enrolments, campus average attendance, exam eligible students, and attendance defaulters.

* **👨‍🎓 Student Self-Service Portal (`student-dashboard.html`)**:
  * **Student Registration**: Register with Full Name, Roll Number, Email, Password, Phone Number, Course, Specialization, and Semester.
  * **Student Login**: Sign in with registered student email and password.
  * **Personal Profile Card**: Displays student name, roll number, course, branch, semester, phone, and customizable bio/address.
  * **Cumulative Attendance Tracker**: Interactive circular progress gauge with 75% threshold badge and subject-by-subject attendance progress bars.
  * **Academic Report Card**: Full breakdown of marks across enrolled subjects with total scores, letter grades, aggregate percentage, and estimated 10-point CGPA.
  * **Interactive Homework Checklist**: View active assignments with due dates and click to toggle between *Pending* and *Submitted*.
  * **Weekly Class Timetable**: Daily lecture slots and laboratory venues.
  * **Live Notice Feed**: Read college announcements broadcast by the administration.
  * **Edit Profile**: Update phone number, residential address, and personal bio.

---

## 🛠️ Technology Stack

* **Structure**: Semantic HTML5 (4-page multi-page architecture: `index.html`, `login.html`, `admin-dashboard.html`, `student-dashboard.html`).
* **Styling**: Modern responsive CSS3 with CSS Custom Variables, glassmorphism, responsive flex/grid layouts, badges, and dark/light mode.
* **Logic**: Vanilla ES6+ JavaScript (`js/storage.js`, `js/auth.js`, `js/admin.js`, `js/student.js`, `js/app.js`).
* **Storage**: Browser `localStorage` for cross-session data persistence + `sessionStorage` for active login sessions.
* **Feedback**: Interactive toast notification system with slide-in animations.

---

## 🔑 Quick Demo Credentials

For testing and micro-project evaluation, use the one-click demo chips on the login page:

| Role | Email | Password | Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `admin123` | `admin-dashboard.html` |
| **Demo Student** | `rahul@gmail.com` | `password123` | `student-dashboard.html` |
| **Demo Student 2 (IoT)** | `priya@gmail.com` | `password123` | `student-dashboard.html` |

---

## 🚀 How to Run the Project

1. Open any browser (Chrome, Edge, Firefox, Safari).
2. Double-click or open `index.html` directly from:
   ```
   d:\workspace\student-management-system\index.html
   ```
3. No Node.js, npm, or local web server is required. Everything runs natively in the browser.

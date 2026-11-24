/* ==========================================================================
   EduManage Pro - LocalStorage Data Engine
   Stores: Students, Admin, Attendance, Marks, Homework, Notices & Sessions
   ========================================================================== */

const STORAGE_KEYS = {
  STUDENTS: 'edumanage_students',
  ADMIN: 'edumanage_admin',
  ATTENDANCE: 'edumanage_attendance',
  MARKS: 'edumanage_marks',
  HOMEWORK: 'edumanage_homework',
  NOTICES: 'edumanage_notices',
  CURRENT_USER: 'edumanage_current_session',
  THEME: 'edumanage_theme'
};

// Initial Seed Data for Instant Demonstration
const DEFAULT_ADMIN = {
  email: 'admin@gmail.com',
  password: 'admin123',
  name: 'Prof. Vikram Malhotra',
  role: 'admin',
  title: 'Chief Academic Administrator'
};

const DEFAULT_STUDENTS = [
  {
    id: 'STU101',
    rollNo: '23CS101',
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    password: 'password123',
    phone: '+91 98765 43210',
    course: 'B.Tech',
    specialization: 'Artificial Intelligence & ML',
    semester: 'Semester 2',
    gender: 'Male',
    dob: '2005-04-12',
    address: '42 Lotus Colony, Green Park, New Delhi',
    bio: 'Aspiring AI researcher & full-stack enthusiast.',
    joinDate: '2023-08-15',
    status: 'Active'
  },
  {
    id: 'STU102',
    rollNo: '23CS102',
    name: 'Priya Patel',
    email: 'priya@gmail.com',
    password: 'password123',
    phone: '+91 98234 56789',
    course: 'B.Tech',
    specialization: 'Internet of Things (IoT)',
    semester: 'Semester 2',
    gender: 'Female',
    dob: '2005-09-22',
    address: '15 Diamond Avenue, Ahmedabad, Gujarat',
    bio: 'Hardware tinkerer, robotics club coordinator.',
    joinDate: '2023-08-16',
    status: 'Active'
  },
  {
    id: 'STU103',
    rollNo: '23CS103',
    name: 'Aman Verma',
    email: 'aman@gmail.com',
    password: 'password123',
    phone: '+91 91234 56780',
    course: 'B.Tech',
    specialization: 'Computer Science (Core)',
    semester: 'Semester 2',
    gender: 'Male',
    dob: '2004-11-05',
    address: '88 Shanti Nagar, Lucknow, UP',
    bio: 'Competitive coder and open source contributor.',
    joinDate: '2023-08-15',
    status: 'Active'
  },
  {
    id: 'STU104',
    rollNo: '23BC104',
    name: 'Ananya Roy',
    email: 'ananya@gmail.com',
    password: 'password123',
    phone: '+91 99887 76655',
    course: 'BCA',
    specialization: 'Cloud Computing & Cyber Security',
    semester: 'Semester 2',
    gender: 'Female',
    dob: '2005-01-18',
    address: '10 Park Street, Kolkata, WB',
    bio: 'Cloud architecture learner & UI designer.',
    joinDate: '2023-08-20',
    status: 'Active'
  },
  {
    id: 'STU105',
    rollNo: '23CM105',
    name: 'Rohan Mehra',
    email: 'rohan@gmail.com',
    password: 'password123',
    phone: '+91 94567 89012',
    course: 'B.Com',
    specialization: 'Banking & Financial Markets',
    semester: 'Semester 2',
    gender: 'Male',
    dob: '2005-07-30',
    address: '12 Marine Drive, Mumbai, Maharashtra',
    bio: 'FinTech researcher & stock market analyst.',
    joinDate: '2023-08-18',
    status: 'Active'
  }
];

const DEFAULT_ATTENDANCE = {
  'STU101': {
    overallPercentage: 88,
    totalClasses: 120,
    attended: 106,
    subjects: [
      { code: 'CS201', name: 'Data Structures & Algorithms', total: 30, attended: 27 },
      { code: 'AI202', name: 'Introduction to AI & Python', total: 30, attended: 28 },
      { code: 'MA203', name: 'Discrete Mathematics', total: 30, attended: 25 },
      { code: 'EC204', name: 'Digital Electronics', total: 30, attended: 26 }
    ]
  },
  'STU102': {
    overallPercentage: 92,
    totalClasses: 120,
    attended: 110,
    subjects: [
      { code: 'CS201', name: 'Data Structures & Algorithms', total: 30, attended: 28 },
      { code: 'IOT202', name: 'Microcontrollers & Sensors', total: 30, attended: 29 },
      { code: 'MA203', name: 'Discrete Mathematics', total: 30, attended: 26 },
      { code: 'EC204', name: 'Digital Electronics', total: 30, attended: 27 }
    ]
  },
  'STU103': {
    overallPercentage: 74,
    totalClasses: 120,
    attended: 89,
    subjects: [
      { code: 'CS201', name: 'Data Structures & Algorithms', total: 30, attended: 24 },
      { code: 'CS202', name: 'Object Oriented Programming', total: 30, attended: 22 },
      { code: 'MA203', name: 'Discrete Mathematics', total: 30, attended: 21 },
      { code: 'EC204', name: 'Digital Electronics', total: 30, attended: 22 }
    ]
  },
  'STU104': {
    overallPercentage: 95,
    totalClasses: 100,
    attended: 95,
    subjects: [
      { code: 'BCA201', name: 'Web Technologies & JS', total: 25, attended: 25 },
      { code: 'BCA202', name: 'Database Management Systems', total: 25, attended: 24 },
      { code: 'BCA203', name: 'Operating Systems', total: 25, attended: 23 },
      { code: 'BCA204', name: 'Cloud Architecture Basics', total: 25, attended: 23 }
    ]
  },
  'STU105': {
    overallPercentage: 82,
    totalClasses: 90,
    attended: 74,
    subjects: [
      { code: 'BC201', name: 'Corporate Accounting', total: 25, attended: 21 },
      { code: 'BC202', name: 'Business Economics', total: 25, attended: 20 },
      { code: 'BC203', name: 'Financial Markets & Services', total: 20, attended: 17 },
      { code: 'BC204', name: 'Business Law', total: 20, attended: 16 }
    ]
  }
};

const DEFAULT_MARKS = {
  'STU101': [
    { code: 'CS201', name: 'Data Structures & Algorithms', internal: 28, midterm: 38, finalExam: 45, total: 111, max: 120, grade: 'A+' },
    { code: 'AI202', name: 'Introduction to AI & Python', internal: 29, midterm: 39, finalExam: 47, total: 115, max: 120, grade: 'A+' },
    { code: 'MA203', name: 'Discrete Mathematics', internal: 24, midterm: 32, finalExam: 39, total: 95, max: 120, grade: 'A' },
    { code: 'EC204', name: 'Digital Electronics', internal: 25, midterm: 34, finalExam: 40, total: 99, max: 120, grade: 'A' }
  ],
  'STU102': [
    { code: 'CS201', name: 'Data Structures & Algorithms', internal: 29, midterm: 37, finalExam: 46, total: 112, max: 120, grade: 'A+' },
    { code: 'IOT202', name: 'Microcontrollers & Sensors', internal: 30, midterm: 40, finalExam: 48, total: 118, max: 120, grade: 'A+' },
    { code: 'MA203', name: 'Discrete Mathematics', internal: 26, midterm: 35, finalExam: 41, total: 102, max: 120, grade: 'A' },
    { code: 'EC204', name: 'Digital Electronics', internal: 28, midterm: 37, finalExam: 44, total: 109, max: 120, grade: 'A+' }
  ],
  'STU103': [
    { code: 'CS201', name: 'Data Structures & Algorithms', internal: 22, midterm: 28, finalExam: 34, total: 84, max: 120, grade: 'B' },
    { code: 'CS202', name: 'Object Oriented Programming', internal: 25, midterm: 31, finalExam: 38, total: 94, max: 120, grade: 'A' },
    { code: 'MA203', name: 'Discrete Mathematics', internal: 20, midterm: 26, finalExam: 30, total: 76, max: 120, grade: 'C' },
    { code: 'EC204', name: 'Digital Electronics', internal: 23, midterm: 29, finalExam: 35, total: 87, max: 120, grade: 'B+' }
  ],
  'STU104': [
    { code: 'BCA201', name: 'Web Technologies & JS', internal: 30, midterm: 39, finalExam: 48, total: 117, max: 120, grade: 'A+' },
    { code: 'BCA202', name: 'Database Management Systems', internal: 28, midterm: 38, finalExam: 46, total: 112, max: 120, grade: 'A+' },
    { code: 'BCA203', name: 'Operating Systems', internal: 27, midterm: 36, finalExam: 43, total: 106, max: 120, grade: 'A' },
    { code: 'BCA204', name: 'Cloud Architecture Basics', internal: 29, midterm: 38, finalExam: 47, total: 114, max: 120, grade: 'A+' }
  ],
  'STU105': [
    { code: 'BC201', name: 'Corporate Accounting', internal: 26, midterm: 34, finalExam: 41, total: 101, max: 120, grade: 'A' },
    { code: 'BC202', name: 'Business Economics', internal: 25, midterm: 33, finalExam: 40, total: 98, max: 120, grade: 'A' },
    { code: 'BC203', name: 'Financial Markets & Services', internal: 27, midterm: 35, finalExam: 42, total: 104, max: 120, grade: 'A' },
    { code: 'BC204', name: 'Business Law', internal: 24, midterm: 31, finalExam: 38, total: 93, max: 120, grade: 'B+' }
  ]
};

const DEFAULT_HOMEWORK = [
  {
    id: 'HW1',
    subject: 'Data Structures & Algorithms',
    title: 'Implement Binary Search Tree & Traversal in C++',
    assignedDate: '2026-11-15',
    dueDate: '2026-11-25',
    description: 'Write complete program for BST Insertion, Deletion, In-order, Pre-order and Post-order traversal with test cases.',
    course: 'B.Tech',
    status: 'Pending'
  },
  {
    id: 'HW2',
    subject: 'AI & Python Programming',
    title: 'Build A* Search Algorithm for 8-Puzzle Problem',
    assignedDate: '2026-11-17',
    dueDate: '2026-11-28',
    description: 'Implement Manhattan distance heuristic and submit working Jupyter notebook with step-by-step state visualization.',
    course: 'B.Tech',
    status: 'Submitted'
  },
  {
    id: 'HW3',
    subject: 'Internet of Things (IoT)',
    title: 'ESP32 DHT11 Sensor Reading via MQTT Protocol',
    assignedDate: '2026-11-18',
    dueDate: '2026-11-30',
    description: 'Connect temperature sensor with ESP32 board and publish live JSON telemetry readings to Adafruit IO dashboard.',
    course: 'B.Tech',
    status: 'Pending'
  },
  {
    id: 'HW4',
    subject: 'Web Technologies & JS',
    title: 'Responsive Student Management Dashboard',
    assignedDate: '2026-11-19',
    dueDate: '2026-12-05',
    description: 'Design multi-role portal using HTML, CSS, JavaScript and localStorage with toast notifications and filterable tables.',
    course: 'BCA',
    status: 'Submitted'
  }
];

const DEFAULT_NOTICES = [
  {
    id: 'NOT1',
    title: 'Mid-Term Semester Examination Schedule Announced',
    date: '2026-11-18',
    category: 'Exam',
    author: 'Dean of Academics',
    content: 'Mid-term theory and practical examinations for B.Tech, BCA and B.Com will commence from December 10, 2026. Hall tickets available in student portal soon.'
  },
  {
    id: 'NOT2',
    title: 'Annual Tech Hackathon "CodeCraft 2026" Registrations Open',
    date: '2026-11-16',
    category: 'Event',
    author: 'Student Council',
    content: 'Compete in 36-hour hackathon on AI, IoT & FinTech tracks. Prizes worth INR 1,50,000 + internship offers from premier tech sponsors.'
  },
  {
    id: 'NOT3',
    title: 'Mandatory 75% Attendance Requirement for Semester Exams',
    date: '2026-11-12',
    category: 'Important',
    author: 'Administration Office',
    content: 'Students with attendance below 75% across registered subjects must submit medical exemption certificates before November 30 to avoid debarment.'
  }
];

// LocalStorage Engine Wrapper
const Storage = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(DEFAULT_ADMIN));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MARKS)) {
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(DEFAULT_MARKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOMEWORK)) {
      localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(DEFAULT_HOMEWORK));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
    }
  },

  // Students CRUD
  getStudents() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
    } catch {
      return [];
    }
  },

  saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getStudentById(id) {
    const students = this.getStudents();
    return students.find(s => s.id === id || s.rollNo === id || s.email === id);
  },

  addStudent(studentData) {
    const students = this.getStudents();
    // Generate unique ID
    const newId = 'STU' + (100 + students.length + 1);
    const newStudent = {
      id: newId,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      ...studentData
    };

    students.unshift(newStudent);
    this.saveStudents(students);

    // Initialize blank attendance & marks for new student
    const attendance = this.getAttendance();
    attendance[newId] = {
      overallPercentage: 100,
      totalClasses: 10,
      attended: 10,
      subjects: [
        { code: 'GEN101', name: 'Foundations Course', total: 10, attended: 10 }
      ]
    };
    this.saveAttendance(attendance);

    const marks = this.getMarks();
    marks[newId] = [
      { code: 'GEN101', name: 'Foundations Course', internal: 25, midterm: 35, finalExam: 40, total: 100, max: 120, grade: 'A' }
    ];
    this.saveMarks(marks);

    return newStudent;
  },

  updateStudent(id, updatedFields) {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updatedFields };
      this.saveStudents(students);
      // If current logged in user is this student, update session too
      const current = this.getCurrentUser();
      if (current && current.role === 'student' && current.id === id) {
        this.setCurrentUser({ ...current, ...students[index] });
      }
      return students[index];
    }
    return null;
  },

  deleteStudent(id) {
    let students = this.getStudents();
    students = students.filter(s => s.id !== id);
    this.saveStudents(students);

    // Clean up attendance and marks
    const attendance = this.getAttendance();
    delete attendance[id];
    this.saveAttendance(attendance);

    const marks = this.getMarks();
    delete marks[id];
    this.saveMarks(marks);

    return true;
  },

  // Admin
  getAdmin() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN)) || DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  },

  // Attendance
  getAttendance() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || {};
    } catch {
      return {};
    }
  },

  saveAttendance(data) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data));
  },

  // Marks
  getMarks() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKS)) || {};
    } catch {
      return {};
    }
  },

  saveMarks(data) {
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(data));
  },

  // Homework
  getHomework() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOMEWORK)) || [];
    } catch {
      return [];
    }
  },

  saveHomework(data) {
    localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(data));
  },

  addHomework(item) {
    const list = this.getHomework();
    const newItem = {
      id: 'HW' + (list.length + 1),
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...item
    };
    list.unshift(newItem);
    this.saveHomework(list);
    return newItem;
  },

  // Notices
  getNotices() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES)) || [];
    } catch {
      return [];
    }
  },

  saveNotices(data) {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(data));
  },

  addNotice(notice) {
    const list = this.getNotices();
    const newNotice = {
      id: 'NOT' + (list.length + 1),
      date: new Date().toISOString().split('T')[0],
      ...notice
    };
    list.unshift(newNotice);
    this.saveNotices(list);
    return newNotice;
  },

  // Session Handling
  getCurrentUser() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Reset to initial clean state
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(DEFAULT_ADMIN));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(DEFAULT_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(DEFAULT_MARKS));
    localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(DEFAULT_HOMEWORK));
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
  }
};

// Initialize right away
Storage.init();

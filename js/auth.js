/* ==========================================================================
   EduManage Pro - Authentication Logic
   Student Login & Register, Fixed Admin Login & One-Click Demo Credentials
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in, redirect accordingly
  const currentUser = Storage.getCurrentUser();
  if (currentUser) {
    if (currentUser.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'student-dashboard.html';
    }
    return;
  }

  // Auth Tabs Logic
  const tabBtns = document.querySelectorAll('.auth-tab-btn');
  const forms = {
    'student-login': document.getElementById('studentLoginFormContainer'),
    'student-register': document.getElementById('studentRegisterFormContainer'),
    'admin-login': document.getElementById('adminLoginFormContainer')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      Object.keys(forms).forEach(key => {
        if (forms[key]) {
          forms[key].style.display = key === targetTab ? 'block' : 'none';
        }
      });
    });
  });

  // URL Hash support (e.g. login.html#register opens register tab)
  if (window.location.hash === '#register') {
    const regTabBtn = document.querySelector('[data-tab="student-register"]');
    if (regTabBtn) regTabBtn.click();
  } else if (window.location.hash === '#admin') {
    const adminTabBtn = document.querySelector('[data-tab="admin-login"]');
    if (adminTabBtn) adminTabBtn.click();
  }

  // 1. Student Login Form
  const studentLoginForm = document.getElementById('studentLoginForm');
  if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('studentEmail').value.trim();
      const password = document.getElementById('studentPassword').value;

      if (!email || !password) {
        showToast('Please enter both email and password', 'warning');
        return;
      }

      const students = Storage.getStudents();
      const foundStudent = students.find(s => s.email.toLowerCase() === email.toLowerCase() && s.password === password);

      if (foundStudent) {
        Storage.setCurrentUser({
          ...foundStudent,
          role: 'student'
        });
        showToast(`Welcome back, ${foundStudent.name}! Redirecting...`, 'success');
        setTimeout(() => {
          window.location.href = 'student-dashboard.html';
        }, 800);
      } else {
        showToast('Invalid student email or password. Please try again.', 'danger');
      }
    });
  }

  // 2. Admin Login Form (Fixed Credentials)
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;

      const admin = Storage.getAdmin();

      if (email.toLowerCase() === admin.email.toLowerCase() && password === admin.password) {
        Storage.setCurrentUser({
          name: admin.name,
          email: admin.email,
          role: 'admin',
          title: admin.title
        });
        showToast('Admin authenticated successfully! Entering portal...', 'success');
        setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
        }, 800);
      } else {
        showToast('Invalid Admin credentials! Default: admin@gmail.com / admin123', 'danger');
      }
    });
  }

  // 3. Student Registration Form
  const studentRegisterForm = document.getElementById('studentRegisterForm');
  if (studentRegisterForm) {
    studentRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const rollNo = document.getElementById('regRollNo').value.trim().toUpperCase();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const phone = document.getElementById('regPhone').value.trim();
      const password = document.getElementById('regPassword').value;
      const course = document.getElementById('regCourse').value;
      const specialization = document.getElementById('regSpecialization').value;
      const semester = document.getElementById('regSemester').value;
      const gender = document.getElementById('regGender').value;

      // Validation
      if (!name || !rollNo || !email || !phone || !password) {
        showToast('Please fill all mandatory fields', 'warning');
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'warning');
        return;
      }

      const students = Storage.getStudents();
      // Check existing email
      if (students.some(s => s.email.toLowerCase() === email)) {
        showToast('This email is already registered! Please log in.', 'danger');
        return;
      }
      // Check existing rollNo
      if (students.some(s => s.rollNo.toUpperCase() === rollNo)) {
        showToast('This Roll Number is already registered!', 'danger');
        return;
      }

      const newStudent = Storage.addStudent({
        name,
        rollNo,
        email,
        phone,
        password,
        course,
        specialization,
        semester,
        gender,
        dob: '2005-01-01',
        address: 'Campus Hostel Block A',
        bio: `${course} (${specialization}) student.`
      });

      showToast(`Registration Successful! Welcome, ${name}`, 'success');

      // Auto login new registered student
      Storage.setCurrentUser({
        ...newStudent,
        role: 'student'
      });

      setTimeout(() => {
        window.location.href = 'student-dashboard.html';
      }, 1000);
    });
  }

  // 4. Quick Demo Fill Helpers
  window.quickFillAdmin = function() {
    const adminTab = document.querySelector('[data-tab="admin-login"]');
    if (adminTab) adminTab.click();

    const emailInput = document.getElementById('adminEmail');
    const passInput = document.getElementById('adminPassword');
    if (emailInput && passInput) {
      emailInput.value = 'admin@gmail.com';
      passInput.value = 'admin123';
      showToast('Admin credentials filled! Click Login', 'info', 2000);
    }
  };

  window.quickFillStudent = function() {
    const studentTab = document.querySelector('[data-tab="student-login"]');
    if (studentTab) studentTab.click();

    const emailInput = document.getElementById('studentEmail');
    const passInput = document.getElementById('studentPassword');
    if (emailInput && passInput) {
      emailInput.value = 'rahul@gmail.com';
      passInput.value = 'password123';
      showToast('Demo Student credentials filled! Click Login', 'info', 2000);
    }
  };
});

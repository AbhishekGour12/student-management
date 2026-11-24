/* ==========================================================================
   EduManage Pro - Admin Control Panel Controller
   Student Directory CRUD, Multi-Filter Search, Attendance, Marks & Notices
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure Admin session
  const adminUser = checkAuth('admin');
  if (!adminUser) return;

  // Display admin info in topbar/sidebar
  const adminNameElements = document.querySelectorAll('.admin-display-name');
  adminNameElements.forEach(el => el.textContent = adminUser.name);

  // Tab Navigation in Admin Dashboard
  const navButtons = document.querySelectorAll('.sidebar-nav-btn');
  const sections = {
    'students': document.getElementById('studentsSection'),
    'attendance': document.getElementById('attendanceSection'),
    'marks': document.getElementById('marksSection'),
    'homework': document.getElementById('homeworkSection'),
    'notices': document.getElementById('noticesSection'),
    'analytics': document.getElementById('analyticsSection')
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-section');
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(sections).forEach(key => {
        if (sections[key]) {
          sections[key].style.display = key === target ? 'block' : 'none';
        }
      });

      // Refresh specific section data when visited
      if (target === 'students') renderStudentsTable();
      if (target === 'attendance') populateAttendanceDropdown();
      if (target === 'marks') populateMarksDropdown();
      if (target === 'homework') renderHomeworkTable();
      if (target === 'notices') renderNoticesTable();
      if (target === 'analytics') renderAnalytics();
    });
  });

  // 1. Metrics & Counters
  function updateMetrics() {
    const students = Storage.getStudents();
    const totalEl = document.getElementById('totalStudentsCount');
    const btechEl = document.getElementById('btechCount');
    const bcaEl = document.getElementById('bcaCount');
    const bcomEl = document.getElementById('bcomCount');

    if (totalEl) totalEl.textContent = students.length;
    if (btechEl) btechEl.textContent = students.filter(s => s.course === 'B.Tech').length;
    if (bcaEl) bcaEl.textContent = students.filter(s => s.course === 'BCA').length;
    if (bcomEl) bcomEl.textContent = students.filter(s => s.course === 'B.Com').length;
  }

  // 2. Render Students Table with Search & Filters
  function renderStudentsTable() {
    updateMetrics();
    const students = Storage.getStudents();
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    // Search query
    const searchQuery = (document.getElementById('studentSearchInput')?.value || '').toLowerCase().trim();
    // Filters
    const courseFilter = document.getElementById('courseFilter')?.value || 'all';
    const specFilter = document.getElementById('specFilter')?.value || 'all';
    const semFilter = document.getElementById('semFilter')?.value || 'all';

    const filtered = students.filter(s => {
      // Search matches
      const matchesSearch = !searchQuery || 
        s.name.toLowerCase().includes(searchQuery) ||
        s.rollNo.toLowerCase().includes(searchQuery) ||
        s.id.toLowerCase().includes(searchQuery) ||
        s.phone.toLowerCase().includes(searchQuery) ||
        s.email.toLowerCase().includes(searchQuery);

      // Course filter
      const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
      // Specialization filter
      const matchesSpec = specFilter === 'all' || s.specialization.toLowerCase().includes(specFilter.toLowerCase());
      // Semester filter
      const matchesSem = semFilter === 'all' || s.semester === semFilter;

      return matchesSearch && matchesCourse && matchesSpec && matchesSem;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
            <strong>No students found matching your criteria.</strong>
            <p style="font-size: 0.8rem; margin-top: 0.25rem;">Try clearing your filters or search keywords.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(s => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="user-avatar" style="width: 38px; height: 38px; font-size: 0.95rem;">
              ${s.name.charAt(0)}
            </div>
            <div>
              <strong style="color: var(--text-main); font-size: 0.9rem;">${s.name}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${s.email}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-family: monospace; font-weight: 700; background: var(--bg-input); padding: 0.2rem 0.5rem; border-radius: 4px;">
            ${s.rollNo}
          </span>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${s.id}</div>
        </td>
        <td>
          <span class="badge badge-primary">${s.course}</span>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${s.specialization}</div>
        </td>
        <td>
          <span class="badge badge-info">${s.semester}</span>
        </td>
        <td style="font-size: 0.825rem; font-family: monospace;">
          ${s.phone}
        </td>
        <td>
          <span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">
            ${s.status || 'Active'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-outline btn-sm btn-icon" title="Edit Student" onclick="openEditStudentModal('${s.id}')">
              ✏️
            </button>
            <button class="btn btn-outline btn-sm btn-icon" title="Delete Student" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" onclick="confirmDeleteStudent('${s.id}', '${s.name}')">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Event listeners for filters and search input
  const searchInput = document.getElementById('studentSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderStudentsTable);

  const courseFilter = document.getElementById('courseFilter');
  if (courseFilter) courseFilter.addEventListener('change', renderStudentsTable);

  const specFilter = document.getElementById('specFilter');
  if (specFilter) specFilter.addEventListener('change', renderStudentsTable);

  const semFilter = document.getElementById('semFilter');
  if (semFilter) semFilter.addEventListener('change', renderStudentsTable);

  // 3. Add Student Form Handler
  const addStudentForm = document.getElementById('addStudentForm');
  if (addStudentForm) {
    addStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newStudentName').value.trim();
      const rollNo = document.getElementById('newStudentRollNo').value.trim().toUpperCase();
      const email = document.getElementById('newStudentEmail').value.trim().toLowerCase();
      const phone = document.getElementById('newStudentPhone').value.trim();
      const password = document.getElementById('newStudentPassword').value || 'password123';
      const course = document.getElementById('newStudentCourse').value;
      const specialization = document.getElementById('newStudentSpecialization').value;
      const semester = document.getElementById('newStudentSemester').value;
      const gender = document.getElementById('newStudentGender').value;

      if (!name || !rollNo || !email || !phone) {
        showToast('Please fill all mandatory fields', 'warning');
        return;
      }

      const existingStudents = Storage.getStudents();
      if (existingStudents.some(s => s.rollNo === rollNo)) {
        showToast('A student with this Roll Number already exists!', 'danger');
        return;
      }
      if (existingStudents.some(s => s.email === email)) {
        showToast('A student with this Email already exists!', 'danger');
        return;
      }

      Storage.addStudent({
        name,
        rollNo,
        email,
        phone,
        password,
        course,
        specialization,
        semester,
        gender
      });

      showToast(`Student ${name} added successfully!`, 'success');
      closeModal('addStudentModal');
      addStudentForm.reset();
      renderStudentsTable();
    });
  }

  // 4. Edit Student Modal Logic
  window.openEditStudentModal = function(id) {
    const student = Storage.getStudentById(id);
    if (!student) return;

    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentRollNo').value = student.rollNo;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentPhone').value = student.phone;
    document.getElementById('editStudentCourse').value = student.course;
    document.getElementById('editStudentSpecialization').value = student.specialization;
    document.getElementById('editStudentSemester').value = student.semester;
    document.getElementById('editStudentStatus').value = student.status || 'Active';

    openModal('editStudentModal');
  };

  const editStudentForm = document.getElementById('editStudentForm');
  if (editStudentForm) {
    editStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editStudentId').value;
      const name = document.getElementById('editStudentName').value.trim();
      const phone = document.getElementById('editStudentPhone').value.trim();
      const course = document.getElementById('editStudentCourse').value;
      const specialization = document.getElementById('editStudentSpecialization').value;
      const semester = document.getElementById('editStudentSemester').value;
      const status = document.getElementById('editStudentStatus').value;

      Storage.updateStudent(id, {
        name,
        phone,
        course,
        specialization,
        semester,
        status
      });

      showToast(`Student details updated successfully!`, 'success');
      closeModal('editStudentModal');
      renderStudentsTable();
    });
  }

  // 5. Delete Student
  window.confirmDeleteStudent = function(id, name) {
    if (confirm(`Are you sure you want to delete student "${name}" (ID: ${id})?\nThis action will also remove their attendance and marks records.`)) {
      Storage.deleteStudent(id);
      showToast(`Student ${name} deleted successfully!`, 'info');
      renderStudentsTable();
    }
  };

  // 6. Attendance Manager Logic
  function populateAttendanceDropdown() {
    const students = Storage.getStudents();
    const select = document.getElementById('attendanceStudentSelect');
    if (!select) return;

    select.innerHTML = '<option value="">-- Select Student to View/Mark Attendance --</option>' + 
      students.map(s => `<option value="${s.id}">${s.rollNo} - ${s.name} (${s.course} ${s.specialization})</option>`).join('');

    select.addEventListener('change', () => {
      renderStudentAttendanceDetails(select.value);
    });

    if (students.length > 0) {
      select.value = students[0].id;
      renderStudentAttendanceDetails(students[0].id);
    }
  }

  function renderStudentAttendanceDetails(studentId) {
    const container = document.getElementById('attendanceDetailsContainer');
    if (!container) return;

    if (!studentId) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Please select a student from the dropdown above.</p>';
      return;
    }

    const student = Storage.getStudentById(studentId);
    const allAttendance = Storage.getAttendance();
    const stuAtt = allAttendance[studentId] || { overallPercentage: 85, totalClasses: 100, attended: 85, subjects: [] };

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800;">${student.name} (${student.rollNo})</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${student.course} • ${student.specialization} • ${student.semester}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <div class="attendance-circle-card">
            <div class="circle-progress" style="--percent: ${stuAtt.overallPercentage}; width: 80px; height: 80px;">
              <span style="font-size: 1.15rem;">${stuAtt.overallPercentage}%</span>
            </div>
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Overall Record</div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${stuAtt.attended} / ${stuAtt.totalClasses} Classes</strong>
              <div style="font-size: 0.75rem; color: ${stuAtt.overallPercentage >= 75 ? 'var(--success)' : 'var(--danger)'}; font-weight: 700;">
                ${stuAtt.overallPercentage >= 75 ? '✓ Exam Eligible (Above 75%)' : '⚠ Attendance Shortage Alert'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Attended</th>
              <th>Total Held</th>
              <th>Percentage</th>
              <th>Quick Mark</th>
            </tr>
          </thead>
          <tbody>
            ${(stuAtt.subjects || []).map((sub, idx) => {
              const pct = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 100;
              return `
                <tr>
                  <td><code>${sub.code}</code></td>
                  <td><strong>${sub.name}</strong></td>
                  <td>${sub.attended}</td>
                  <td>${sub.total}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span class="badge ${pct >= 75 ? 'badge-success' : 'badge-danger'}">${pct}%</span>
                      <div class="progress-bar-container" style="width: 80px;">
                        <div class="progress-bar-fill" style="width: ${pct}%; background: ${pct >= 75 ? 'var(--success)' : 'var(--danger)'}"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-success" onclick="markAttendanceAction('${studentId}', ${idx}, true)">
                      + Present
                    </button>
                    <button class="btn btn-sm btn-danger" style="margin-left: 4px;" onclick="markAttendanceAction('${studentId}', ${idx}, false)">
                      - Absent
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.markAttendanceAction = function(studentId, subjectIndex, isPresent) {
    const allAttendance = Storage.getAttendance();
    const stuAtt = allAttendance[studentId];
    if (!stuAtt || !stuAtt.subjects[subjectIndex]) return;

    stuAtt.subjects[subjectIndex].total += 1;
    stuAtt.totalClasses += 1;
    if (isPresent) {
      stuAtt.subjects[subjectIndex].attended += 1;
      stuAtt.attended += 1;
    }

    stuAtt.overallPercentage = Math.round((stuAtt.attended / stuAtt.totalClasses) * 100);
    allAttendance[studentId] = stuAtt;
    Storage.saveAttendance(allAttendance);

    showToast(`Marked ${isPresent ? 'Present' : 'Absent'} for ${stuAtt.subjects[subjectIndex].name}`, isPresent ? 'success' : 'warning');
    renderStudentAttendanceDetails(studentId);
  };

  // 7. Marks & Grading Manager Logic
  function populateMarksDropdown() {
    const students = Storage.getStudents();
    const select = document.getElementById('marksStudentSelect');
    if (!select) return;

    select.innerHTML = '<option value="">-- Select Student to View/Enter Marks --</option>' + 
      students.map(s => `<option value="${s.id}">${s.rollNo} - ${s.name} (${s.course})</option>`).join('');

    select.addEventListener('change', () => {
      renderStudentMarksDetails(select.value);
    });

    if (students.length > 0) {
      select.value = students[0].id;
      renderStudentMarksDetails(students[0].id);
    }
  }

  function renderStudentMarksDetails(studentId) {
    const container = document.getElementById('marksDetailsContainer');
    if (!container) return;

    if (!studentId) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Please select a student above.</p>';
      return;
    }

    const student = Storage.getStudentById(studentId);
    const allMarks = Storage.getMarks();
    const stuMarks = allMarks[studentId] || [];

    const totalScore = stuMarks.reduce((acc, m) => acc + (m.total || 0), 0);
    const maxPossible = stuMarks.reduce((acc, m) => acc + (m.max || 120), 0);
    const percentage = maxPossible > 0 ? ((totalScore / maxPossible) * 100).toFixed(1) : '0';
    const cgpa = (percentage / 9.5).toFixed(2);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800;">Academic Performance: ${student.name}</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${student.course} • ${student.specialization} • Roll: ${student.rollNo}</span>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="background: var(--bg-input); padding: 0.6rem 1rem; border-radius: var(--radius-md); text-align: center;">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AGGREGATE</div>
            <strong style="font-size: 1.15rem; color: var(--primary);">${percentage}%</strong>
          </div>
          <div style="background: var(--primary-light); padding: 0.6rem 1.25rem; border-radius: var(--radius-md); text-align: center;">
            <div style="font-size: 0.75rem; color: var(--primary); font-weight: 700;">ESTIMATED CGPA</div>
            <strong style="font-size: 1.25rem; color: var(--primary);">${cgpa} / 10</strong>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openAddSubjectModal('${studentId}')">
            + Add Subject Marks
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Internal (/30)</th>
              <th>Mid-Term (/40)</th>
              <th>Final Exam (/50)</th>
              <th>Total (/120)</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${stuMarks.length > 0 ? stuMarks.map((m, idx) => `
              <tr>
                <td><code>${m.code}</code></td>
                <td><strong>${m.name}</strong></td>
                <td>${m.internal}</td>
                <td>${m.midterm}</td>
                <td>${m.finalExam}</td>
                <td><strong>${m.total}</strong></td>
                <td>
                  <span class="badge ${m.grade.startsWith('A') ? 'badge-success' : (m.grade.startsWith('B') ? 'badge-primary' : 'badge-warning')}">
                    ${m.grade}
                  </span>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No marks recorded yet for this student.</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }

  window.openAddSubjectModal = function(studentId) {
    document.getElementById('marksModalStudentId').value = studentId;
    openModal('addMarksModal');
  };

  const addMarksForm = document.getElementById('addMarksForm');
  if (addMarksForm) {
    addMarksForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentId = document.getElementById('marksModalStudentId').value;
      const code = document.getElementById('markSubjectCode').value.trim().toUpperCase();
      const name = document.getElementById('markSubjectName').value.trim();
      const internal = Number(document.getElementById('markInternal').value) || 0;
      const midterm = Number(document.getElementById('markMidterm').value) || 0;
      const finalExam = Number(document.getElementById('markFinal').value) || 0;

      const total = internal + midterm + finalExam;
      let grade = 'F';
      const pct = (total / 120) * 100;
      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B+';
      else if (pct >= 60) grade = 'B';
      else if (pct >= 50) grade = 'C';

      const allMarks = Storage.getMarks();
      if (!allMarks[studentId]) allMarks[studentId] = [];

      allMarks[studentId].push({
        code,
        name,
        internal,
        midterm,
        finalExam,
        total,
        max: 120,
        grade
      });

      Storage.saveMarks(allMarks);
      showToast(`Marks for ${name} added successfully!`, 'success');
      closeModal('addMarksModal');
      addMarksForm.reset();
      renderStudentMarksDetails(studentId);
    });
  }

  // 8. Homework & Assignments Logic
  function renderHomeworkTable() {
    const homework = Storage.getHomework();
    const tbody = document.getElementById('homeworkTableBody');
    if (!tbody) return;

    tbody.innerHTML = homework.map((hw, idx) => `
      <tr>
        <td><strong>${hw.subject}</strong></td>
        <td>${hw.title}</td>
        <td><span class="badge badge-primary">${hw.course}</span></td>
        <td><span style="font-size: 0.85rem;">📅 ${hw.dueDate}</span></td>
        <td><span class="badge ${hw.status === 'Submitted' ? 'badge-success' : 'badge-warning'}">${hw.status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm btn-icon" style="color: var(--danger);" onclick="deleteHomework('${hw.id}')">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');
  }

  const addHomeworkForm = document.getElementById('addHomeworkForm');
  if (addHomeworkForm) {
    addHomeworkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const course = document.getElementById('hwCourse').value;
      const subject = document.getElementById('hwSubject').value.trim();
      const title = document.getElementById('hwTitle').value.trim();
      const dueDate = document.getElementById('hwDueDate').value;
      const description = document.getElementById('hwDescription').value.trim();

      Storage.addHomework({
        course,
        subject,
        title,
        dueDate,
        description
      });

      showToast('New homework assignment published to students!', 'success');
      closeModal('addHomeworkModal');
      addHomeworkForm.reset();
      renderHomeworkTable();
    });
  }

  window.deleteHomework = function(id) {
    let list = Storage.getHomework();
    list = list.filter(h => h.id !== id);
    Storage.saveHomework(list);
    showToast('Homework assignment removed', 'info');
    renderHomeworkTable();
  };

  // 9. Notices & Announcements Logic
  function renderNoticesTable() {
    const notices = Storage.getNotices();
    const tbody = document.getElementById('noticesTableBody');
    if (!tbody) return;

    tbody.innerHTML = notices.map(n => `
      <tr>
        <td><strong>${n.title}</strong></td>
        <td><span class="badge ${n.category === 'Exam' ? 'badge-danger' : (n.category === 'Event' ? 'badge-primary' : 'badge-warning')}">${n.category}</span></td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${n.date}</td>
        <td style="font-size: 0.85rem;">${n.author}</td>
        <td>
          <button class="btn btn-outline btn-sm btn-icon" style="color: var(--danger);" onclick="deleteNotice('${n.id}')">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');
  }

  const addNoticeForm = document.getElementById('addNoticeForm');
  if (addNoticeForm) {
    addNoticeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('noticeTitle').value.trim();
      const category = document.getElementById('noticeCategory').value;
      const content = document.getElementById('noticeContent').value.trim();
      const author = adminUser.name || 'Administration Office';

      Storage.addNotice({
        title,
        category,
        content,
        author
      });

      showToast('Notice published successfully to student bulletin board!', 'success');
      closeModal('addNoticeModal');
      addNoticeForm.reset();
      renderNoticesTable();
    });
  }

  window.deleteNotice = function(id) {
    let list = Storage.getNotices();
    list = list.filter(n => n.id !== id);
    Storage.saveNotices(list);
    showToast('Notice removed', 'info');
    renderNoticesTable();
  };

  // 10. Analytics / Insights Section
  function renderAnalytics() {
    const students = Storage.getStudents();
    const attendance = Storage.getAttendance();

    // Calculate averages
    let totalPct = 0;
    let count = 0;
    Object.keys(attendance).forEach(k => {
      if (attendance[k]?.overallPercentage) {
        totalPct += attendance[k].overallPercentage;
        count++;
      }
    });

    const avgAttendance = count > 0 ? Math.round(totalPct / count) : 0;
    const avgAttendanceEl = document.getElementById('analyticsAvgAttendance');
    if (avgAttendanceEl) avgAttendanceEl.textContent = avgAttendance + '%';

    // Eligible vs Defaulters
    let eligible = 0;
    let defaulters = 0;
    Object.keys(attendance).forEach(k => {
      if (attendance[k]?.overallPercentage >= 75) eligible++;
      else defaulters++;
    });

    const eligibleEl = document.getElementById('analyticsEligibleStudents');
    const defaultersEl = document.getElementById('analyticsDefaulters');
    if (eligibleEl) eligibleEl.textContent = eligible;
    if (defaultersEl) defaultersEl.textContent = defaulters;
  }

  // Initial renders
  renderStudentsTable();
});

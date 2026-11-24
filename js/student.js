/* ==========================================================================
   EduManage Pro - Student Portal Controller
   Personalized Profile, Report Card, Attendance Ring, Homework & Timetable
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure Student session
  const studentUser = checkAuth('student');
  if (!studentUser) return;

  // Refresh student data from latest storage (in case updated by admin)
  const currentStudent = Storage.getStudentById(studentUser.id) || studentUser;

  // Tab Navigation in Student Dashboard
  const navButtons = document.querySelectorAll('.sidebar-nav-btn');
  const sections = {
    'overview': document.getElementById('studentOverviewSection'),
    'marks': document.getElementById('studentMarksSection'),
    'attendance': document.getElementById('studentAttendanceSection'),
    'homework': document.getElementById('studentHomeworkSection'),
    'timetable': document.getElementById('studentTimetableSection'),
    'notices': document.getElementById('studentNoticesSection')
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
    });
  });

  // 1. Render Profile Banner & User Elements
  function renderProfile() {
    const nameEls = document.querySelectorAll('.student-display-name');
    nameEls.forEach(el => el.textContent = currentStudent.name);

    const rollEls = document.querySelectorAll('.student-display-roll');
    rollEls.forEach(el => el.textContent = currentStudent.rollNo);

    const courseEls = document.querySelectorAll('.student-display-course');
    courseEls.forEach(el => el.textContent = `${currentStudent.course} • ${currentStudent.specialization}`);

    const semEls = document.querySelectorAll('.student-display-sem');
    semEls.forEach(el => el.textContent = currentStudent.semester);

    const emailEls = document.querySelectorAll('.student-display-email');
    emailEls.forEach(el => el.textContent = currentStudent.email);

    const phoneEls = document.querySelectorAll('.student-display-phone');
    phoneEls.forEach(el => el.textContent = currentStudent.phone);

    const avatarEls = document.querySelectorAll('.student-display-avatar');
    avatarEls.forEach(el => el.textContent = currentStudent.name.charAt(0));

    const bioEl = document.getElementById('studentBio');
    if (bioEl) bioEl.textContent = currentStudent.bio || 'Active full-time enrolled student.';

    const addressEl = document.getElementById('studentAddress');
    if (addressEl) addressEl.textContent = currentStudent.address || 'Campus Hostel Block';
  }

  // 2. Render Attendance
  function renderAttendance() {
    const allAttendance = Storage.getAttendance();
    const stuAtt = allAttendance[currentStudent.id] || {
      overallPercentage: 85,
      totalClasses: 100,
      attended: 85,
      subjects: []
    };

    const pctEl = document.getElementById('studentOverallAttendancePct');
    if (pctEl) pctEl.textContent = `${stuAtt.overallPercentage}%`;

    const circleEl = document.getElementById('studentAttendanceCircle');
    if (circleEl) {
      circleEl.style.setProperty('--percent', stuAtt.overallPercentage);
    }

    const ratioEl = document.getElementById('studentAttendanceRatio');
    if (ratioEl) ratioEl.textContent = `${stuAtt.attended} / ${stuAtt.totalClasses} Total Lectures`;

    const statusBadge = document.getElementById('attendanceStatusBadge');
    if (statusBadge) {
      if (stuAtt.overallPercentage >= 75) {
        statusBadge.className = 'badge badge-success';
        statusBadge.textContent = '✓ Eligible for Semester Exams';
      } else {
        statusBadge.className = 'badge badge-danger';
        statusBadge.textContent = '⚠ Below 75% Attendance Shortage';
      }
    }

    // Subject Breakdown Table
    const tbody = document.getElementById('studentAttendanceTableBody');
    if (tbody) {
      if (!stuAtt.subjects || stuAtt.subjects.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No attendance data logged yet.</td></tr>`;
      } else {
        tbody.innerHTML = stuAtt.subjects.map(sub => {
          const pct = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 100;
          return `
            <tr>
              <td><code>${sub.code}</code></td>
              <td><strong>${sub.name}</strong></td>
              <td>${sub.attended}</td>
              <td>${sub.total}</td>
              <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span class="badge ${pct >= 75 ? 'badge-success' : 'badge-danger'}">${pct}%</span>
                  <div class="progress-bar-container" style="width: 100px;">
                    <div class="progress-bar-fill" style="width: ${pct}%; background: ${pct >= 75 ? 'var(--success)' : 'var(--danger)'}"></div>
                  </div>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // 3. Render Marks & Report Card
  function renderMarks() {
    const allMarks = Storage.getMarks();
    const marksList = allMarks[currentStudent.id] || [];

    const totalScore = marksList.reduce((acc, m) => acc + (m.total || 0), 0);
    const maxPossible = marksList.reduce((acc, m) => acc + (m.max || 120), 0);
    const percentage = maxPossible > 0 ? ((totalScore / maxPossible) * 100).toFixed(1) : '0';
    const cgpa = (percentage / 9.5).toFixed(2);

    const cgpaEl = document.getElementById('studentCgpaDisplay');
    if (cgpaEl) cgpaEl.textContent = `${cgpa} / 10`;

    const pctEl = document.getElementById('studentAggregatePct');
    if (pctEl) pctEl.textContent = `${percentage}%`;

    const totalSubsEl = document.getElementById('studentTotalSubjects');
    if (totalSubsEl) totalSubsEl.textContent = marksList.length;

    const tbody = document.getElementById('studentMarksTableBody');
    if (tbody) {
      if (marksList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No grades recorded yet.</td></tr>`;
      } else {
        tbody.innerHTML = marksList.map(m => `
          <tr>
            <td><code>${m.code}</code></td>
            <td><strong>${m.name}</strong></td>
            <td>${m.internal} / 30</td>
            <td>${m.midterm} / 40</td>
            <td>${m.finalExam} / 50</td>
            <td><strong>${m.total}</strong> / 120</td>
            <td>
              <span class="badge ${m.grade.startsWith('A') ? 'badge-success' : (m.grade.startsWith('B') ? 'badge-primary' : 'badge-warning')}">
                ${m.grade}
              </span>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // 4. Render Homework & Assignments
  function renderHomework() {
    const allHomework = Storage.getHomework();
    // Filter for student's course or show all
    const relevantHw = allHomework.filter(h => !h.course || h.course === currentStudent.course);

    const listContainer = document.getElementById('studentHomeworkList');
    if (!listContainer) return;

    if (relevantHw.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No active homework or assignments assigned.</p>';
      return;
    }

    listContainer.innerHTML = relevantHw.map(hw => `
      <div class="panel-card" style="margin-bottom: 1.25rem; border-left: 4px solid var(--primary);">
        <div class="panel-card-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span class="badge badge-primary" style="margin-bottom: 0.25rem;">${hw.subject}</span>
              <h4 style="font-size: 1.1rem; font-weight: 800;">${hw.title}</h4>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Due Date: <strong>${hw.dueDate}</strong></span>
              <span class="badge ${hw.status === 'Submitted' ? 'badge-success' : 'badge-warning'}" id="hwStatusBadge_${hw.id}">${hw.status}</span>
            </div>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.6;">
            ${hw.description}
          </p>
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-sm ${hw.status === 'Submitted' ? 'btn-outline' : 'btn-primary'}" onclick="toggleHomeworkStatus('${hw.id}')">
              ${hw.status === 'Submitted' ? '✓ Mark as Pending' : 'Submit Assignment'}
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  window.toggleHomeworkStatus = function(hwId) {
    const allHw = Storage.getHomework();
    const item = allHw.find(h => h.id === hwId);
    if (!item) return;

    item.status = item.status === 'Submitted' ? 'Pending' : 'Submitted';
    Storage.saveHomework(allHw);

    showToast(`Assignment status changed to ${item.status}!`, 'success');
    renderHomework();
  };

  // 5. Render Notices
  function renderNotices() {
    const notices = Storage.getNotices();
    const container = document.getElementById('studentNoticesContainer');
    if (!container) return;

    if (notices.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No announcements published at this time.</p>';
      return;
    }

    container.innerHTML = notices.map(n => `
      <div class="notice-item">
        <div class="notice-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge ${n.category === 'Exam' ? 'badge-danger' : (n.category === 'Event' ? 'badge-primary' : 'badge-warning')}">${n.category}</span>
            <span class="notice-title">${n.title}</span>
          </div>
          <span class="notice-date">📅 ${n.date}</span>
        </div>
        <p class="notice-body">${n.content}</p>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: right;">
          Published by: <strong>${n.author}</strong>
        </div>
      </div>
    `).join('');
  }

  // 6. Edit Profile Form
  const editProfileForm = document.getElementById('studentEditProfileForm');
  if (editProfileForm) {
    // Pre-populate
    document.getElementById('editStudentPhoneInput').value = currentStudent.phone || '';
    document.getElementById('editStudentAddressInput').value = currentStudent.address || '';
    document.getElementById('editStudentBioInput').value = currentStudent.bio || '';

    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('editStudentPhoneInput').value.trim();
      const address = document.getElementById('editStudentAddressInput').value.trim();
      const bio = document.getElementById('editStudentBioInput').value.trim();

      const updated = Storage.updateStudent(currentStudent.id, {
        phone,
        address,
        bio
      });

      showToast('Profile information updated successfully!', 'success');
      closeModal('editProfileModal');
      renderProfile();
    });
  }

  // Initial calls
  renderProfile();
  renderAttendance();
  renderMarks();
  renderHomework();
  renderNotices();
});

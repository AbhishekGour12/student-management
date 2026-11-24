/* ==========================================================================
   EduManage Pro - Common App Helpers & UI Utilities
   Toast System, Modal Manager, Theme Switcher & Auth Guards
   ========================================================================== */

// Toast Notification Manager
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    danger: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${icons[type] || '🔔'}</span>
    <div style="flex: 1;">
      <div style="font-weight: 700; font-size: 0.85rem; text-transform: capitalize;">${type}</div>
      <div style="font-size: 0.825rem; opacity: 0.9;">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modals when clicking overlay outside container
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Theme Switcher (Dark / Light)
function initTheme() {
  const savedTheme = localStorage.getItem('edumanage_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('edumanage_theme', newTheme);
  updateThemeIcons(newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info', 2000);
}

function updateThemeIcons(theme) {
  const btns = document.querySelectorAll('.theme-toggle-btn');
  btns.forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  });
}

// Auth Guard Check
function checkAuth(requiredRole = null) {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return null;
  }
  if (requiredRole && currentUser.role !== requiredRole) {
    showToast(`Access denied: requires ${requiredRole} access`, 'danger');
    window.location.href = currentUser.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html';
    return null;
  }
  return currentUser;
}

// Logout action
function handleLogout() {
  Storage.logout();
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 500);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
});

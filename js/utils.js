/**
 * Donation Management System — Shared Utilities
 */

/* ─── Toast Notifications ────────────────────────────────── */
(function () {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
})();

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] || 'ℹ️'}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

/* ─── Routing ────────────────────────────────────────────── */
function redirectTo(url, delay = 0) {
  delay ? setTimeout(() => { window.location.href = url; }, delay) : (window.location.href = url);
}

/* ─── Currency ───────────────────────────────────────────── */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
}

function formatCompact(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

/* ─── String Helpers ─────────────────────────────────────── */
function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── DOM Helpers ────────────────────────────────────────── */
function qs(selector, root = document) { return root.querySelector(selector); }
function qsa(selector, root = document) { return [...root.querySelectorAll(selector)]; }

function setLoading(btn, loading) {
  loading ? (btn.classList.add('btn-loading'), btn.setAttribute('disabled', ''))
          : (btn.classList.remove('btn-loading'), btn.removeAttribute('disabled'));
}

/* ─── Form Validation ────────────────────────────────────── */
function showFieldError(inputEl, message) {
  inputEl.classList.add('error');
  const errEl = inputEl.closest('.form-group')?.querySelector('.form-error');
  if (errEl) { errEl.textContent = message; errEl.classList.add('visible'); }
}
function clearFieldError(inputEl) {
  inputEl.classList.remove('error');
  const errEl = inputEl.closest('.form-group')?.querySelector('.form-error');
  if (errEl) errEl.classList.remove('visible');
}

/* ─── Password Strength ──────────────────────────────────── */
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}
const STRENGTH_LABELS  = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_CLASSES = ['', 'active-weak', 'active-fair', 'active-good', 'active-strong'];

function updateStrengthBars(pwd) {
  const score = getPasswordStrength(pwd);
  qsa('.pwd-bar').forEach((bar, i) => {
    bar.className = 'pwd-bar';
    if (i < score) bar.classList.add(STRENGTH_CLASSES[score]);
  });
  const label = qs('.pwd-strength-label');
  if (label) label.textContent = pwd ? `Strength: ${STRENGTH_LABELS[score]}` : '';
}

/**
 * Donation Management System — Auth Module
 * Handles register, login, session, and route guards.
 * Storage: localStorage (keys: dms_users, dms_session)
 * Roles:   'user'  → donation submission flow → dashboard.html
 *          'admin' → management dashboard      → admin.html
 */

const AUTH_USERS_KEY   = 'dms_users';
const AUTH_SESSION_KEY = 'dms_session';

/* ─── Helpers ────────────────────────────────────────────── */
function _loadUsers() {
    try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || []; }
    catch (e) { return []; }
}
function _saveUsers(users) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

/** Simple hash (not crypto — demo only) */
function _hashPassword(pwd) {
    let hash = 5381;
    for (let i = 0; i < pwd.length; i++) hash = ((hash << 5) + hash) ^ pwd.charCodeAt(i);
    return (hash >>> 0).toString(16);
}

/* ─── Admin Seed ─────────────────────────────────────────── */
/**
 * Ensures the default System Administrator account exists.
 * Idempotent — skips silently if any admin user is already present.
 * Credentials: admin@donatehub.com / Admin@123
 */
function _seedAdminIfNeeded() {
    const users = _loadUsers();
    if (users.some(function (u) { return u.role === 'admin'; })) return;
    users.push({
        id:             'u_admin_seed',
        fullName:       'System Administrator',
        email:          'admin@donatehub.com',
        password:       _hashPassword('Admin@123'),
        role:           'admin',
        joinedAt:       new Date().toISOString(),
        avatar:         null,
        totalDonated:   0,
        donationsCount: 0
    });
    _saveUsers(users);
}

/* ─── Register ───────────────────────────────────────────── */
function registerUser(fullName, email, password) {
    const users      = _loadUsers();
    const emailLower = email.trim().toLowerCase();
    if (users.find(function (u) { return u.email === emailLower; })) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const user = {
        id:             'u_' + Date.now(),
        fullName:       fullName.trim(),
        email:          emailLower,
        password:       _hashPassword(password),
        role:           'user',          /* all self-registered accounts are donors */
        joinedAt:       new Date().toISOString(),
        avatar:         null,
        totalDonated:   0,
        donationsCount: 0
    };
    users.push(user);
    _saveUsers(users);
    _startSession(user);
    return { success: true, user };
}

/* ─── Login ──────────────────────────────────────────────── */
function loginUser(email, password) {
    const users      = _loadUsers();
    const emailLow   = email.trim().toLowerCase();
    const user       = users.find(function (u) { return u.email === emailLow; });
    if (!user) return { success: false, message: 'No account found with this email.' };
    if (user.password !== _hashPassword(password))
        return { success: false, message: 'Incorrect password.' };
    _startSession(user);
    return { success: true, user };
}

/* ─── Session ────────────────────────────────────────────── */
function _startSession(user) {
    const session = {
        userId:         user.id,
        email:          user.email,
        fullName:       user.fullName,
        avatar:         user.avatar,
        role:           user.role || 'user',
        loginAt:        new Date().toISOString(),
        totalDonated:   user.totalDonated   || 0,
        donationsCount: user.donationsCount || 0
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function getSession() {
    try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)); }
    catch (e) { return null; }
}

function logoutUser() {
    localStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = 'login.html';
}

/* ─── Route Guards ───────────────────────────────────────── */

/** Redirect to login if no session exists. Returns session or null. */
function requireAuth() {
    const session = getSession();
    if (!session) { window.location.href = 'login.html'; return null; }
    return session;
}

/**
 * Require an active admin session.
 * Unauthenticated users are sent to login.html.
 * Authenticated non-admin users are sent to 403.html (Access Forbidden).
 * @returns {object|null} session
 */
function requireAdmin() {
    const session = getSession();
    if (!session) { window.location.href = 'login.html'; return null; }
    if (session.role !== 'admin') { window.location.href = '403.html'; return null; }
    return session;
}

/**
 * If a valid session already exists, redirect to the correct home page
 * based on the user's role.  Used on login.html / index.html.
 */
function redirectIfAuth() {
    const session = getSession();
    if (!session) return;
    window.location.href = session.role === 'admin' ? 'admin-gateway-portal.html' : 'dashboard.html';
}

/* ─── Profile UI Helper ──────────────────────────────────── */
function renderHeaderProfile(session) {
    const initials  = getInitials(session.fullName);
    const roleLabel = session.role === 'admin' ? 'Administrator' : 'Member';
    const profileBtn = qs('#profileBtn');
    if (!profileBtn) return;

    profileBtn.innerHTML = `
    <div class="avatar">
      ${session.avatar
        ? `<img class="avatar-img" src="${session.avatar}" alt="${session.fullName}" />`
        : initials}
      <span class="avatar-status"></span>
    </div>
    <div class="profile-info">
      <span class="profile-name">${session.fullName.split(' ')[0]}</span>
      <span class="profile-role">${roleLabel}</span>
    </div>
    <span class="profile-chevron">▾</span>`;

    const dropdown = qs('#profileDropdown');
    if (dropdown) {
        const nameEl  = qs('.dropdown-user-name',  dropdown);
        const emailEl = qs('.dropdown-user-email', dropdown);
        if (nameEl)  nameEl.textContent  = session.fullName;
        if (emailEl) emailEl.textContent = session.email;

        /* ── Admin Portal shortcut (role-gated) ─────────────────
           Injected dynamically so no admin URL leaks into HTML
           served to ordinary users. Only visible when the active
           session carries role === 'admin'.                       */
        if (session.role === 'admin') {
            if (!dropdown.querySelector('#adminPortalShortcut')) {
                const link      = document.createElement('a');
                link.id         = 'adminPortalShortcut';
                link.href       = 'admin-gateway-portal.html';
                link.className  = 'dropdown-item';
                link.setAttribute('role', 'menuitem');
                link.innerHTML  = '<span>🛡️</span> Admin Portal';
                link.style.cssText = 'color:#f59e0b; font-weight:700;';

                /* Insert before the first divider so it groups with nav links */
                const firstDivider = dropdown.querySelector('.dropdown-divider');
                if (firstDivider) {
                    dropdown.insertBefore(link, firstDivider);
                } else {
                    dropdown.appendChild(link);
                }
            }
        }
    }

    /* Toggle dropdown */
    profileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const open = dropdown.classList.toggle('open');
        profileBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function () {
        dropdown.classList.remove('open');
        profileBtn.setAttribute('aria-expanded', 'false');
    });

    /* Logout */
    const logoutBtn = qs('#logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', function () { logoutUser(); });
}

/* ─── Seed admin on every load (idempotent) ─────────────── */
_seedAdminIfNeeded();

/**
 * Dev utility — promote any registered account to role:'admin'.
 * Run from the browser console:
 *
 *   promoteToAdmin('your@email.com')
 *
 * The change is written to localStorage immediately.
 * You must log out and back in for the new role to take effect.
 *
 * @param {string} email  Email of the account to promote
 * @returns {boolean} true if the account was found and updated
 */
function promoteToAdmin(email) {
    const users    = _loadUsers();
    /* Single-admin rule: reject if any admin account already exists */
    if (users.some(function (u) { return u.role === 'admin'; })) {
        console.warn('[DonateHub] An administrator account already exists. Only one admin is permitted.');
        return false;
    }
    const emailLow = (email || '').trim().toLowerCase();
    const user     = users.find(function (u) { return u.email === emailLow; });
    if (!user) {
        console.warn('[DonateHub] No account found for:', email);
        return false;
    }
    user.role = 'admin';
    _saveUsers(users);
    console.info('[DonateHub] ' + user.fullName + ' (' + user.email + ') promoted to admin.' +
                 ' Log out and back in to activate.');
    return true;
}

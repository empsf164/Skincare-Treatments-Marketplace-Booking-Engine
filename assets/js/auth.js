/**
 * LUMÉA - Authentication & User State Module
 * Supports Client vs Provider roles, Demo sessions, Login, Signup, and Navbar state sync.
 */

(function () {
  const AUTH_STORAGE_KEY = 'lumea_auth_user';

  function getCurrentUser() {
    try {
      const u = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
      if (u && u.isLoggedIn) return u;
    } catch (e) {}

    // Default logged in guest demo for smooth experience
    return {
      isLoggedIn: true,
      role: 'client', // 'client' or 'provider'
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  }

  function setCurrentUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    updateAuthNavbarUI();
  }

  function login(email, password, role = 'client') {
    const user = {
      isLoggedIn: true,
      role: role,
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email,
      avatar: role === 'provider' 
        ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    setCurrentUser(user);
    window.LumeaNotifications?.success(`Welcome back, ${user.name}!`);
    return user;
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.LumeaNotifications?.info('You have been logged out.');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  }

  function updateAuthNavbarUI() {
    const user = getCurrentUser();
    const authActionsContainer = document.getElementById('navbarAuthActions');
    if (!authActionsContainer) return;

    if (user && user.isLoggedIn) {
      authActionsContainer.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-sm btn-secondary d-flex align-items-center gap-2 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding: 0.4rem 0.85rem;">
            <img src="${user.avatar}" alt="${user.name}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">
            <span class="d-none d-md-inline fw-semibold">${user.name.split(' ')[0]}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="background-color:var(--bg-surface); border-color:var(--border-subtle); border-radius:var(--radius-md);">
            <li><span class="dropdown-header text-muted small">${user.email} (${user.role.toUpperCase()})</span></li>
            ${user.role === 'provider' ? `
              <li><a class="dropdown-item small" href="manage-availability.html"><i class="bi bi-calendar-range me-2 text-sage"></i>Manage Availability</a></li>
              <li><a class="dropdown-item small" href="provider-setup.html"><i class="bi bi-sliders me-2 text-sage"></i>Clinic Setup</a></li>
            ` : `
              <li><a class="dropdown-item small" href="my-bookings.html"><i class="bi bi-calendar-check me-2 text-sage"></i>My Bookings</a></li>
            `}
            <li><hr class="dropdown-divider" style="border-color:var(--border-subtle);"></li>
            <li><button class="dropdown-item small text-danger" id="btnLogoutNav"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</button></li>
          </ul>
        </div>
      `;

      const logoutBtn = authActionsContainer.querySelector('#btnLogoutNav');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
        });
      }
    } else {
      authActionsContainer.innerHTML = `
        <a href="login.html" class="btn btn-sm btn-outline-secondary d-none d-sm-inline-flex">Sign In</a>
        <a href="signup.html" class="btn btn-sm btn-secondary d-none d-sm-inline-flex">Sign Up</a>
      `;
    }
  }

  function initAuthForms() {
    // Login form
    const loginForm = document.getElementById('lumeaLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value || 'ananya.sharma@example.com';
        const password = document.getElementById('loginPassword')?.value || 'password';
        const role = document.querySelector('input[name="authRole"]:checked')?.value || 'client';
        
        login(email, password, role);
        if (role === 'provider') {
          window.location.href = 'manage-availability.html';
        } else {
          window.location.href = 'my-bookings.html';
        }
      });
    }

    // Signup form
    const signupForm = document.getElementById('lumeaSignupForm');
    if (signupForm) {
      // Role switch toggle
      const roleRadios = document.querySelectorAll('input[name="signupRole"]');
      const providerFields = document.getElementById('providerSpecificFields');

      roleRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (providerFields) {
            if (radio.value === 'provider' && radio.checked) {
              providerFields.classList.remove('d-none');
            } else {
              providerFields.classList.add('d-none');
            }
          }
        });
      });

      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName')?.value || 'Client';
        const email = document.getElementById('signupEmail')?.value || 'user@example.com';
        const role = document.querySelector('input[name="signupRole"]:checked')?.value || 'client';

        setCurrentUser({
          isLoggedIn: true,
          role: role,
          name: name,
          email: email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        });

        window.LumeaNotifications?.success(`Welcome to LUMÉA, ${name}!`);
        if (role === 'provider') {
          window.location.href = 'provider-setup.html';
        } else {
          window.location.href = 'treatments.html';
        }
      });
    }

    // Forgot password form
    const forgotForm = document.getElementById('lumeaForgotForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail')?.value;
        window.LumeaNotifications?.success(`Password reset link sent to ${email}. Check your inbox!`, 5000);
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateAuthNavbarUI();
    initAuthForms();
  });

  window.LumeaAuth = {
    getUser: getCurrentUser,
    setUser: setCurrentUser,
    login: login,
    logout: logout,
    updateNavbar: updateAuthNavbarUI
  };
})();

/**
 * LUMÉA - Notification & Toast System
 */

(function () {
  let toastContainer = null;

  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.querySelector('.toast-container-lumea');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container-lumea';
        toastContainer.setAttribute('aria-live', 'polite');
        toastContainer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  function showToast(message, type = 'success', duration = 4000, action = null) {
    const container = ensureToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast-item-lumea toast-${type}`;

    let iconClass = 'bi bi-check-circle-fill text-success';
    if (type === 'error' || type === 'danger') {
      iconClass = 'bi bi-exclamation-circle-fill text-danger';
    } else if (type === 'warning') {
      iconClass = 'bi bi-exclamation-triangle-fill text-warning';
    } else if (type === 'info') {
      iconClass = 'bi bi-info-circle-fill text-info';
    }

    toast.innerHTML = `
      <div class="toast-icon-wrap">
        <i class="${iconClass}"></i>
      </div>
      <div class="flex-grow-1">
        <div class="toast-text" style="font-size: 0.88rem; font-weight: 500; color: var(--text-primary);">${message}</div>
      </div>
      ${action ? `<button class="btn btn-sm btn-link p-0 text-sage toast-action-btn" style="text-decoration:none; font-size:0.82rem; font-weight:700;">${action.text}</button>` : ''}
      <button type="button" class="btn-close-toast" aria-label="Close" style="border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-size:0.9rem; padding:0 0 0 8px;">
        <i class="bi bi-x-lg"></i>
      </button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.btn-close-toast');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', dismiss);

    if (action && action.onClick) {
      const actionBtn = toast.querySelector('.toast-action-btn');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.preventDefault();
          action.onClick();
          dismiss();
        });
      }
    }

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  window.LumeaNotifications = {
    show: showToast,
    success: (msg, dur, action) => showToast(msg, 'success', dur, action),
    error: (msg, dur, action) => showToast(msg, 'error', dur, action),
    info: (msg, dur, action) => showToast(msg, 'info', dur, action),
    warning: (msg, dur, action) => showToast(msg, 'warning', dur, action)
  };
})();

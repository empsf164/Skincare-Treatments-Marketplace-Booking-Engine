/**
 * LUMÉA - Secure Deposit Payment Engine
 * Frontend-ready payment simulation with Card, UPI, and Digital Wallet support.
 */

(function () {
  const BOOKINGS_STORAGE_KEY = 'lumea_user_bookings';

  function getPendingBooking() {
    try {
      const draft = JSON.parse(sessionStorage.getItem('lumea_pending_payment_booking'));
      if (draft) return draft;
    } catch (e) {}

    // Fallback demo booking payload if directly visiting payment page
    return {
      id: 'LUM-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      treatmentId: 'hydrafacial-md',
      treatmentTitle: 'Hydrafacial MD® Elite Infusion',
      providerId: 'prov-aesthetica-dermal',
      providerName: 'Aesthétika Advanced Dermatology',
      location: 'Bandra West, Mumbai',
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      dateFormatted: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timeSlot: '02:30 PM',
      durationMinutes: 60,
      addons: [{ name: 'Clinical Red/Blue LED Therapy', price: 999 }],
      customer: {
        fullName: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        phone: '+91 98201 54321',
        skinNotes: 'First time Hydrafacial'
      },
      total: 6698,
      deposit: 1340,
      balance: 5358,
      status: 'pending_payment'
    };
  }

  function initPaymentPage() {
    const booking = getPendingBooking();
    renderPaymentSummary(booking);
    bindPaymentForm(booking);
  }

  function renderPaymentSummary(booking) {
    const summaryMount = document.getElementById('paymentBookingSummary');
    if (!summaryMount) return;

    summaryMount.innerHTML = `
      <div class="lumea-card p-4">
        <span class="badge-lumea badge-sage mb-2"><i class="bi bi-shield-lock-fill"></i> Deposit Guarantee</span>
        <h4 class="mb-1" style="font-family: var(--font-display);">${booking.treatmentTitle}</h4>
        <p class="text-muted small mb-3"><i class="bi bi-geo-alt-fill text-sage me-1"></i>${booking.providerName} (${booking.location})</p>

        <div class="p-3 bg-surface-subtle rounded-3 mb-3 small">
          <div class="d-flex justify-content-between mb-1">
            <span class="text-muted">Appointment:</span>
            <span class="fw-semibold">${booking.dateFormatted}</span>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="text-muted">Time Slot:</span>
            <span class="fw-semibold text-sage">${booking.timeSlot}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="text-muted">Client Name:</span>
            <span class="fw-semibold">${booking.customer.fullName}</span>
          </div>
        </div>

        <div class="small mb-3">
          <div class="d-flex justify-content-between py-1 border-bottom">
            <span class="text-muted">Total Treatment Value</span>
            <span class="fw-semibold">₹${booking.total.toLocaleString()}</span>
          </div>
          <div class="d-flex justify-content-between py-1 border-bottom">
            <span class="text-muted">Deposit Required Today</span>
            <span class="fw-bold text-sage">₹${booking.deposit.toLocaleString()}</span>
          </div>
          <div class="d-flex justify-content-between py-1 text-muted">
            <span>Remaining at Appointment</span>
            <span>₹${booking.balance.toLocaleString()}</span>
          </div>
        </div>

        <div class="payment-security-badge">
          <i class="bi bi-patch-check-fill" style="font-size: 1.25rem;"></i>
          <div>
            <div>100% Booking Protection</div>
            <div style="font-size: 0.72rem; opacity: 0.85; font-weight: 400;">Your deposit is held securely until treatment check-in.</div>
          </div>
        </div>
      </div>
    `;

    const payBtnLabel = document.getElementById('payBtnDepositAmount');
    if (payBtnLabel) {
      payBtnLabel.textContent = `₹${booking.deposit.toLocaleString()}`;
    }
  }

  function bindPaymentForm(booking) {
    const paymentForm = document.getElementById('lumeaPaymentForm');
    if (!paymentForm) return;

    // Card formatters
    const cardInput = document.getElementById('payCardNumber');
    const expiryInput = document.getElementById('payExpiry');
    const cvvInput = document.getElementById('payCvv');

    if (cardInput) {
      cardInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = val;
      });
    }

    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        e.target.value = val;
      });
    }

    if (cvvInput) {
      cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
      });
    }

    // Payment method tabs
    document.querySelectorAll('.payment-method-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const method = card.getAttribute('data-method');
        
        document.querySelectorAll('.payment-method-pane').forEach(p => p.classList.add('d-none'));
        const activePane = document.getElementById(`pane_${method}`);
        if (activePane) activePane.classList.remove('d-none');
      });
    });

    // Handle Payment Submission
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      processPayment(booking);
    });

    // Handle Simulation Trigger (Simulate Failure)
    const btnSimulateFail = document.getElementById('btnSimulatePaymentFailure');
    if (btnSimulateFail) {
      btnSimulateFail.addEventListener('click', () => {
        processPayment(booking, true);
      });
    }
  }

  function processPayment(booking, simulateFailure = false) {
    const submitBtn = document.getElementById('btnSubmitDepositPayment');
    const originalText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Securing Appointment & Processing Deposit...
      `;
    }

    setTimeout(() => {
      if (simulateFailure) {
        if (submitBtn) {
          submitBtn.removeAttribute('disabled');
          submitBtn.innerHTML = originalText;
        }
        window.LumeaNotifications?.error('Payment authorization failed: Demo simulation. Please retry or choose another method.');
        return;
      }

      // Success Flow
      booking.status = 'confirmed';
      booking.depositPaid = true;
      booking.paidAt = new Date().toISOString();
      booking.transactionRef = 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase();

      // Save to user bookings
      saveBookingToStorage(booking);

      // Save confirmed reference for confirmation page
      sessionStorage.setItem('lumea_last_confirmed_booking', JSON.stringify(booking));

      window.location.href = `booking-confirmation.html?ref=${booking.id}`;
    }, 1800);
  }

  function saveBookingToStorage(booking) {
    try {
      const existing = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
      const updated = [booking, ...existing.filter(b => b.id !== booking.id)];
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lumeaPaymentForm')) {
      initPaymentPage();
    }
  });

  window.LumeaPayments = {
    init: initPaymentPage,
    getPendingBooking: getPendingBooking
  };
})();

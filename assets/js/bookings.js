/**
 * LUMÉA - Client Bookings Management Engine
 * Handles Upcoming, Past, and Cancelled treatments, Rescheduling, ICS generation, and Cancellation.
 */

(function () {
  const BOOKINGS_STORAGE_KEY = 'lumea_user_bookings';

  const SEED_BOOKINGS = [
    {
      id: 'LUM-849201',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      treatmentId: 'hydrafacial-md',
      treatmentTitle: 'Hydrafacial MD® Elite Infusion',
      providerId: 'prov-aesthetica-dermal',
      providerName: 'Aesthétika Advanced Dermatology',
      location: 'Bandra West, Mumbai',
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      dateFormatted: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timeSlot: '03:30 PM',
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
      depositPaid: true,
      transactionRef: 'TXN-940281',
      status: 'upcoming'
    },
    {
      id: 'LUM-512093',
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      treatmentId: 'biorepeel-glow',
      treatmentTitle: 'BioRePeelCl3® 35% TCA Glow Peel',
      providerId: 'prov-lumina-skin-lab',
      providerName: 'Lumina Aesthetic Skin Studio',
      location: 'Indiranagar, Bengaluru',
      date: new Date(Date.now() - 86400000 * 18).toISOString(),
      dateFormatted: new Date(Date.now() - 86400000 * 18).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timeSlot: '11:00 AM',
      durationMinutes: 50,
      addons: [],
      customer: {
        fullName: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        phone: '+91 98201 54321'
      },
      total: 5098,
      deposit: 1020,
      balance: 4078,
      depositPaid: true,
      transactionRef: 'TXN-481903',
      status: 'past'
    },
    {
      id: 'LUM-381029',
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      treatmentId: 'clinical-led-therapy',
      treatmentTitle: 'Dermalux® Tri-Wave MD Phototherapy',
      providerId: 'prov-pure-botanique-spa',
      providerName: 'Pure Botanique Holistic Skin Atelier',
      location: 'Koregaon Park, Pune',
      date: new Date(Date.now() - 86400000 * 42).toISOString(),
      dateFormatted: new Date(Date.now() - 86400000 * 42).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timeSlot: '04:00 PM',
      durationMinutes: 45,
      addons: [],
      customer: {
        fullName: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        phone: '+91 98201 54321'
      },
      total: 2698,
      deposit: 540,
      balance: 2158,
      depositPaid: true,
      transactionRef: 'TXN-102938',
      status: 'cancelled'
    }
  ];

  function getBookings() {
    try {
      const list = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY));
      if (list && list.length > 0) return list;
    } catch (e) {}

    // Seed defaults
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(SEED_BOOKINGS));
    return SEED_BOOKINGS;
  }

  function saveBookings(list) {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
  }

  function getBookingById(id) {
    const list = getBookings();
    return list.find(b => b.id === id) || list[0];
  }

  function cancelBooking(id) {
    const list = getBookings();
    const target = list.find(b => b.id === id);
    if (target) {
      target.status = 'cancelled';
      saveBookings(list);
      window.LumeaNotifications?.success(`Booking ${id} cancelled. Your deposit has been credited according to cancellation policy.`);
      return true;
    }
    return false;
  }

  function rescheduleBooking(id, newDate, newSlot) {
    const list = getBookings();
    const target = list.find(b => b.id === id);
    if (target) {
      target.date = new Date(newDate).toISOString();
      target.dateFormatted = new Date(newDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      target.timeSlot = newSlot;
      target.status = 'upcoming';
      saveBookings(list);
      window.LumeaNotifications?.success(`Appointment rescheduled to ${target.dateFormatted} at ${newSlot}!`);
      return true;
    }
    return false;
  }

  function generateIcsCalendar(booking) {
    const title = `${booking.treatmentTitle} - LUMÉA Skincare`;
    const description = `Your appointment with ${booking.providerName} for ${booking.treatmentTitle}. Ref: ${booking.id}. Location: ${booking.location}`;
    const location = `${booking.providerName}, ${booking.location}`;
    
    // Create ICS file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LUMEA Skincare Marketplace//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `LUMEA-Appointment-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.LumeaNotifications?.info('Calendar invite (.ics) downloaded.');
  }

  function renderBookingsPage() {
    const listContainer = document.getElementById('myBookingsListArea');
    if (!listContainer) return;

    const list = getBookings();
    const activeTab = document.querySelector('.booking-filter-tab.active')?.getAttribute('data-tab') || 'upcoming';

    let filtered = [];
    if (activeTab === 'upcoming') {
      filtered = list.filter(b => b.status === 'upcoming' || b.status === 'confirmed');
    } else if (activeTab === 'past') {
      filtered = list.filter(b => b.status === 'past');
    } else if (activeTab === 'cancelled') {
      filtered = list.filter(b => b.status === 'cancelled');
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="lumea-card text-center p-5">
          <div class="mb-3 text-muted" style="font-size: 2.5rem;"><i class="bi bi-calendar-x"></i></div>
          <h4 style="font-family: var(--font-display);">No ${activeTab} appointments</h4>
          <p class="text-muted small mb-4">Discover verified skincare treatments and book your next session with confidence.</p>
          <div>
            <a href="treatments.html" class="btn btn-primary"><i class="bi bi-search me-1"></i> Explore Treatments</a>
          </div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(booking => {
      const isUpcoming = booking.status === 'upcoming' || booking.status === 'confirmed';
      const isCancelled = booking.status === 'cancelled';

      return `
        <div class="booking-record-card" data-booking-id="${booking.id}">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold" style="font-size:0.88rem; color:var(--text-muted);">${booking.id}</span>
              <span class="booking-status-tag status-${booking.status === 'confirmed' ? 'upcoming' : booking.status}">
                ${booking.status === 'confirmed' ? 'Confirmed & Reserved' : booking.status.toUpperCase()}
              </span>
            </div>
            <div class="text-muted small">
              Deposit Paid: <span class="fw-bold text-sage">₹${booking.deposit.toLocaleString()}</span> • Balance: ₹${booking.balance.toLocaleString()}
            </div>
          </div>

          <div class="row align-items-center g-3">
            <div class="col-md-5">
              <h5 class="mb-1" style="font-family: var(--font-display); font-size:1.35rem;">${booking.treatmentTitle}</h5>
              <div class="text-muted small"><i class="bi bi-geo-alt-fill text-sage me-1"></i>${booking.providerName} (${booking.location})</div>
            </div>
            <div class="col-md-3">
              <div class="fw-bold text-sage" style="font-size:0.95rem;">
                <i class="bi bi-calendar3 me-1"></i>${booking.dateFormatted}
              </div>
              <div class="text-muted small"><i class="bi bi-clock me-1"></i>${booking.timeSlot} (${booking.durationMinutes} min)</div>
            </div>
            <div class="col-md-4 text-md-end">
              <div class="d-flex flex-wrap gap-2 justify-content-md-end">
                ${isUpcoming ? `
                  <button type="button" class="btn btn-sm btn-outline-secondary btn-booking-reschedule" data-id="${booking.id}">
                    <i class="bi bi-calendar2-range me-1"></i> Reschedule
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary btn-booking-cal" data-id="${booking.id}">
                    <i class="bi bi-calendar-plus"></i>
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary text-danger border-danger btn-booking-cancel" data-id="${booking.id}">
                    Cancel
                  </button>
                ` : isCancelled ? `
                  <a href="booking.html?treatment=${booking.treatmentId}&provider=${booking.providerId}" class="btn btn-sm btn-primary">
                    <i class="bi bi-arrow-repeat me-1"></i> Re-book
                  </a>
                ` : `
                  <a href="booking.html?treatment=${booking.treatmentId}&provider=${booking.providerId}" class="btn btn-sm btn-primary">
                    <i class="bi bi-arrow-repeat me-1"></i> Book Again
                  </a>
                `}
                <button type="button" class="btn btn-sm btn-secondary btn-booking-view" data-id="${booking.id}">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    bindBookingActionButtons();
  }

  function bindBookingActionButtons() {
    // Reschedule
    document.querySelectorAll('.btn-booking-reschedule').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openRescheduleModal(id);
      });
    });

    // Calendar
    document.querySelectorAll('.btn-booking-cal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const booking = getBookingById(id);
        if (booking) generateIcsCalendar(booking);
      });
    });

    // Cancel
    document.querySelectorAll('.btn-booking-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you wish to cancel booking ${id}? Your deposit will be refunded per policy.`)) {
          cancelBooking(id);
          renderBookingsPage();
        }
      });
    });

    // View Details Modal
    document.querySelectorAll('.btn-booking-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const booking = getBookingById(id);
        if (booking) openDetailsModal(booking);
      });
    });
  }

  function openDetailsModal(booking) {
    let modalEl = document.getElementById('bookingDetailsModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'bookingDetailsModal';
      modalEl.className = 'modal fade';
      modalEl.tabIndex = -1;
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);">
          <div class="modal-header border-bottom">
            <h5 class="modal-title" style="font-family: var(--font-display);">Booking Details • ${booking.id}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <span class="badge-lumea badge-sage">${booking.status.toUpperCase()}</span>
              <h4 class="mt-2 mb-1" style="font-family: var(--font-display);">${booking.treatmentTitle}</h4>
              <p class="text-muted small"><i class="bi bi-geo-alt-fill text-sage me-1"></i>${booking.providerName} (${booking.location})</p>
            </div>

            <div class="p-3 bg-surface-subtle rounded-3 mb-3 small">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Appointment Time:</span>
                <span class="fw-semibold">${booking.dateFormatted} at ${booking.timeSlot}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Client Name:</span>
                <span class="fw-semibold">${booking.customer?.fullName || 'Client'}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Transaction ID:</span>
                <span class="fw-semibold">${booking.transactionRef || 'N/A'}</span>
              </div>
            </div>

            <div class="small mb-3">
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span class="text-muted">Total Treatment Value</span>
                <span class="fw-bold">₹${booking.total.toLocaleString()}</span>
              </div>
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span class="text-muted">Deposit Paid</span>
                <span class="fw-bold text-sage">₹${booking.deposit.toLocaleString()}</span>
              </div>
              <div class="d-flex justify-content-between py-1 text-muted">
                <span>Remaining at Clinic</span>
                <span>₹${booking.balance.toLocaleString()}</span>
              </div>
            </div>

            ${booking.customer?.skinNotes ? `
              <div class="p-2 bg-surface-subtle rounded-2 small text-muted mb-2">
                <span class="fw-semibold text-primary d-block">Intake Notes:</span>
                ${booking.customer.skinNotes}
              </div>
            ` : ''}
          </div>
          <div class="modal-footer border-top">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  }

  function openRescheduleModal(id) {
    const booking = getBookingById(id);
    if (!booking) return;

    let modalEl = document.getElementById('bookingRescheduleModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'bookingRescheduleModal';
      modalEl.className = 'modal fade';
      modalEl.tabIndex = -1;
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content" style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);">
          <div class="modal-header border-bottom">
            <h5 class="modal-title" style="font-family: var(--font-display);">Reschedule Appointment • ${booking.id}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <p class="text-muted small mb-3">Select a new date and time slot for your ${booking.treatmentTitle} with ${booking.providerName}.</p>
            <div id="rescheduleCalMount"></div>
          </div>
          <div class="modal-footer border-top d-flex justify-content-between">
            <span class="small text-muted" id="rescheduleSelectedSummary">Please pick a new slot.</span>
            <div>
              <button type="button" class="btn btn-secondary btn-sm me-2" data-bs-dismiss="modal">Keep Existing</button>
              <button type="button" class="btn btn-primary btn-sm" id="btnConfirmReschedule" disabled>Confirm New Slot</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();

    let newDate = new Date();
    let newSlot = null;

    new window.LumeaCalendar('#rescheduleCalMount', {
      initialDate: new Date(Date.now() + 86400000),
      onDateSelect: (d) => {
        newDate = d;
      },
      onSlotSelect: (s, d) => {
        newSlot = s;
        newDate = d;
        const confirmBtn = modalEl.querySelector('#btnConfirmReschedule');
        const summary = modalEl.querySelector('#rescheduleSelectedSummary');
        if (confirmBtn) confirmBtn.removeAttribute('disabled');
        if (summary) summary.textContent = `New slot: ${d.toLocaleDateString('en-US', { month:'short', day:'numeric' })} at ${s}`;
      }
    });

    modalEl.querySelector('#btnConfirmReschedule').addEventListener('click', () => {
      if (newSlot) {
        rescheduleBooking(booking.id, newDate, newSlot);
        bsModal.hide();
        renderBookingsPage();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('myBookingsListArea')) {
      renderBookingsPage();

      // Tab switches
      document.querySelectorAll('.booking-filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelectorAll('.booking-filter-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          renderBookingsPage();
        });
      });
    }
  });

  window.LumeaBookings = {
    getAll: getBookings,
    getById: getBookingById,
    cancel: cancelBooking,
    reschedule: rescheduleBooking,
    generateIcs: generateIcsCalendar,
    render: renderBookingsPage
  };
})();

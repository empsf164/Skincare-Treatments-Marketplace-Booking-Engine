/**
 * LUMÉA - Provider & Host Management Module
 * Implements Guided Onboarding Setup and Clean Availability/Schedule Management.
 * Strictly avoids generic dashboards in favor of focused, commercial workflow screens.
 */

(function () {
  const PROVIDER_CONFIG_KEY = 'lumea_provider_profile_config';

  const DEFAULT_SCHEDULE = {
    monday: { active: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
    tuesday: { active: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
    wednesday: { active: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
    thursday: { active: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
    friday: { active: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
    saturday: { active: true, start: '10:00', end: '18:00', breakStart: '13:30', breakEnd: '14:30' },
    sunday: { active: false, start: '10:00', end: '16:00', breakStart: '', breakEnd: '' }
  };

  function getProviderConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROVIDER_CONFIG_KEY));
      if (saved) return saved;
    } catch (e) {}

    return {
      clinicName: 'Aesthétika Advanced Dermatology',
      specialistName: 'Dr. Alisha Merchant',
      providerType: 'Dermatology Clinics',
      location: 'Bandra West, Mumbai',
      advanceBookingDays: 30,
      depositPercent: 20,
      bufferMinutes: 15,
      cancellationNoticeHours: 24,
      schedule: DEFAULT_SCHEDULE,
      blockedDates: ['2026-10-24', '2026-11-01']
    };
  }

  function saveProviderConfig(config) {
    localStorage.setItem(PROVIDER_CONFIG_KEY, JSON.stringify(config));
  }

  // Manage Availability Page Init
  function initManageAvailability() {
    const root = document.getElementById('manageAvailabilityRoot');
    if (!root) return;

    const config = getProviderConfig();
    renderWeeklySchedule(config);
    renderBlockedDates(config);

    // Save schedule button
    const btnSave = document.getElementById('btnSaveSchedule');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        // Collect schedule from DOM
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
          const check = document.getElementById(`day_active_${day}`);
          const start = document.getElementById(`day_start_${day}`);
          const end = document.getElementById(`day_end_${day}`);
          const bStart = document.getElementById(`day_bstart_${day}`);
          const bEnd = document.getElementById(`day_bend_${day}`);

          if (check) config.schedule[day].active = check.checked;
          if (start) config.schedule[day].start = start.value;
          if (end) config.schedule[day].end = end.value;
          if (bStart) config.schedule[day].breakStart = bStart.value;
          if (bEnd) config.schedule[day].breakEnd = bEnd.value;
        });

        const buffer = document.getElementById('configBufferMinutes');
        const deposit = document.getElementById('configDepositPercent');
        const advance = document.getElementById('configAdvanceBookingDays');

        if (buffer) config.bufferMinutes = Number(buffer.value);
        if (deposit) config.depositPercent = Number(deposit.value);
        if (advance) config.advanceBookingDays = Number(advance.value);

        saveProviderConfig(config);
        window.LumeaNotifications?.success('Weekly schedule and booking rules successfully updated!');
      });
    }

    // Add Blocked Date
    const btnAddBlock = document.getElementById('btnAddBlockedDate');
    const inputBlockDate = document.getElementById('inputNewBlockedDate');
    if (btnAddBlock && inputBlockDate) {
      btnAddBlock.addEventListener('click', () => {
        const val = inputBlockDate.value;
        if (!val) {
          window.LumeaNotifications?.warning('Please select a date to block.');
          return;
        }
        if (!config.blockedDates.includes(val)) {
          config.blockedDates.push(val);
          saveProviderConfig(config);
          renderBlockedDates(config);
          inputBlockDate.value = '';
          window.LumeaNotifications?.info(`Date ${val} is now blocked for appointments.`);
        }
      });
    }
  }

  function renderWeeklySchedule(config) {
    const container = document.getElementById('weeklyScheduleListMount');
    if (!container) return;

    const days = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' }
    ];

    container.innerHTML = days.map(d => {
      const sch = config.schedule[d.key] || { active: true, start: '09:00', end: '18:00', breakStart: '', breakEnd: '' };
      return `
        <div class="weekly-schedule-row">
          <div class="d-flex align-items-center gap-3" style="min-width: 140px;">
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" role="switch" id="day_active_${d.key}" ${sch.active ? 'checked' : ''}>
              <label class="form-check-label fw-bold" for="day_active_${d.key}">${d.label}</label>
            </div>
          </div>

          <div class="d-flex flex-wrap align-items-center gap-2 flex-grow-1 justify-content-md-end">
            <div class="d-flex align-items-center gap-1">
              <span class="text-muted small">Hours:</span>
              <input type="time" class="form-control form-control-sm" style="width:115px;" id="day_start_${d.key}" value="${sch.start}" ${!sch.active ? 'disabled' : ''}>
              <span class="text-muted small">to</span>
              <input type="time" class="form-control form-control-sm" style="width:115px;" id="day_end_${d.key}" value="${sch.end}" ${!sch.active ? 'disabled' : ''}>
            </div>

            <div class="d-flex align-items-center gap-1 ms-md-3">
              <span class="text-muted small">Break:</span>
              <input type="time" class="form-control form-control-sm" style="width:110px;" id="day_bstart_${d.key}" value="${sch.breakStart || ''}" placeholder="Break Start" ${!sch.active ? 'disabled' : ''}>
              <span class="text-muted small">-</span>
              <input type="time" class="form-control form-control-sm" style="width:110px;" id="day_bend_${d.key}" value="${sch.breakEnd || ''}" placeholder="Break End" ${!sch.active ? 'disabled' : ''}>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Toggle disabled inputs on switch
    days.forEach(d => {
      const sw = container.querySelector(`#day_active_${d.key}`);
      if (sw) {
        sw.addEventListener('change', () => {
          const rowInputs = sw.closest('.weekly-schedule-row').querySelectorAll('input[type="time"]');
          rowInputs.forEach(i => {
            if (sw.checked) i.removeAttribute('disabled');
            else i.setAttribute('disabled', 'true');
          });
        });
      }
    });
  }

  function renderBlockedDates(config) {
    const list = document.getElementById('blockedDatesListMount');
    if (!list) return;

    if (!config.blockedDates || config.blockedDates.length === 0) {
      list.innerHTML = '<div class="text-muted small p-2">No blocked vacation or holiday dates configured.</div>';
      return;
    }

    list.innerHTML = config.blockedDates.map((dateStr, idx) => `
      <div class="d-flex align-items-center justify-content-between p-2 bg-surface-subtle rounded-2 mb-2">
        <span class="small fw-semibold"><i class="bi bi-calendar-x text-clay me-2"></i>${new Date(dateStr).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}</span>
        <button type="button" class="btn btn-sm text-danger border-0 p-0 btn-remove-block-date" data-index="${idx}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `).join('');

    list.querySelectorAll('.btn-remove-block-date').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        config.blockedDates.splice(idx, 1);
        saveProviderConfig(config);
        renderBlockedDates(config);
        window.LumeaNotifications?.info('Blocked date removed.');
      });
    });
  }

  // Guided Provider Setup Page Init
  function initProviderSetup() {
    const setupForm = document.getElementById('lumeaProviderSetupForm');
    if (!setupForm) return;

    setupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const config = getProviderConfig();

      config.clinicName = document.getElementById('setupClinicName')?.value || config.clinicName;
      config.specialistName = document.getElementById('setupSpecialistName')?.value || config.specialistName;
      config.providerType = document.getElementById('setupProviderType')?.value || config.providerType;
      config.location = document.getElementById('setupLocation')?.value || config.location;

      saveProviderConfig(config);
      window.LumeaNotifications?.success('Provider onboarding complete! Profile is now active on the LUMÉA marketplace.');

      setTimeout(() => {
        window.location.href = 'provider-profile.html?id=prov-aesthetica-dermal';
      }, 1200);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initManageAvailability();
    initProviderSetup();
  });

  window.LumeaProviderManager = {
    getConfig: getProviderConfig,
    saveConfig: saveProviderConfig
  };
})();

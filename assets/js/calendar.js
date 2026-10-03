/**
 * LUMÉA - Calendar & Real-Time Time-Slot Engine
 * Provides dual-view: Interactive Month Grid for Desktop & Smooth Carousel for Mobile.
 */

(function () {
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate realistic time slots
  const DEFAULT_TIME_SLOTS = [
    { time: '09:30 AM', status: 'available' },
    { time: '10:30 AM', status: 'available' },
    { time: '11:45 AM', status: 'almost-full' },
    { time: '01:15 PM', status: 'available' },
    { time: '02:30 PM', status: 'available' },
    { time: '03:45 PM', status: 'almost-full' },
    { time: '05:00 PM', status: 'available' },
    { time: '06:15 PM', status: 'available' },
    { time: '07:30 PM', status: 'unavailable' }
  ];

  class LumeaCalendar {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      this.options = Object.assign({
        onDateSelect: () => {},
        onSlotSelect: () => {},
        initialDate: new Date(),
        selectedSlot: null
      }, options);

      this.currentDate = new Date(this.options.initialDate);
      this.selectedDate = new Date(this.options.initialDate);
      this.selectedSlot = this.options.selectedSlot;

      if (this.container) {
        this.init();
      }
    }

    init() {
      this.render();
      this.bindEvents();
    }

    render() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const today = new Date();

      this.container.innerHTML = `
        <div class="calendar-widget">
          <!-- Desktop Month View -->
          <div class="desktop-calendar-view d-none d-md-block">
            <div class="calendar-header">
              <button type="button" class="btn btn-icon-sm btn-outline-secondary btn-cal-prev" aria-label="Previous month">
                <i class="bi bi-chevron-left"></i>
              </button>
              <h5 class="calendar-month-title mb-0">${MONTH_NAMES[month]} ${year}</h5>
              <button type="button" class="btn btn-icon-sm btn-outline-secondary btn-cal-next" aria-label="Next month">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
            
            <div class="calendar-weekdays">
              ${DAY_NAMES.map(d => `<div>${d}</div>`).join('')}
            </div>
            
            <div class="calendar-days-grid" id="calDaysGrid">
              ${this.generateDaysGridHtml(year, month, today)}
            </div>
          </div>

          <!-- Mobile Date Carousel View -->
          <div class="mobile-calendar-view d-md-none">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="small fw-bold text-uppercase text-muted">Select Date</span>
              <span class="small fw-semibold text-sage">${MONTH_NAMES[month]} ${year}</span>
            </div>
            <div class="mobile-date-carousel" id="mobileDateCarousel">
              ${this.generateCarouselPillsHtml(today)}
            </div>
          </div>

          <!-- Availability Legend -->
          <div class="d-flex align-items-center justify-content-center gap-4 mt-3 pt-3 border-top" style="font-size: 0.76rem; color: var(--text-muted);">
            <div class="d-flex align-items-center gap-1">
              <span style="width:7px; height:7px; border-radius:50%; background:var(--brand-sage);"></span>
              <span>Available</span>
            </div>
            <div class="d-flex align-items-center gap-1">
              <span style="width:7px; height:7px; border-radius:50%; background:var(--brand-clay);"></span>
              <span>Limited Slots</span>
            </div>
            <div class="d-flex align-items-center gap-1">
              <span style="width:7px; height:7px; border-radius:50%; background:var(--text-muted); opacity:0.35;"></span>
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        <!-- Real-Time Time Slots Container -->
        <div class="time-slots-section mt-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h6 class="mb-0"><i class="bi bi-clock me-2 text-sage"></i>Available Slots for <span id="slotSelectedDateLabel" class="text-sage">${this.formatDisplayDate(this.selectedDate)}</span></h6>
            <span class="badge-lumea badge-sage"><i class="bi bi-lightning-charge-fill"></i> Real-Time</span>
          </div>
          <div class="time-slots-grid" id="timeSlotsContainer">
            ${this.generateTimeSlotsHtml()}
          </div>
        </div>
      `;
    }

    generateDaysGridHtml(year, month, today) {
      const firstDay = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();
      let html = '';

      // Empty padding cells for previous month
      for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-day-cell disabled"></div>`;
      }

      for (let day = 1; day <= totalDays; day++) {
        const dateObj = new Date(year, month, day);
        const isPast = dateObj.setHours(0,0,0,0) < today.setHours(0,0,0,0);
        const isSelected = this.isSameDay(dateObj, this.selectedDate);
        
        let extraClass = '';
        if (isPast) {
          extraClass = 'disabled';
        } else if (isSelected) {
          extraClass = 'selected';
        } else {
          // Dynamic slot availability pattern based on day of week
          const dayOfWeek = dateObj.getDay();
          if (dayOfWeek === 0) {
            extraClass = 'has-limited'; // Sunday limited
          } else if (dayOfWeek === 6) {
            extraClass = 'has-limited'; // Saturday high demand
          } else {
            extraClass = 'has-slots';
          }
        }

        html += `
          <button type="button" class="calendar-day-cell ${extraClass}" data-date="${dateObj.toISOString()}" ${isPast ? 'disabled' : ''}>
            ${day}
          </button>
        `;
      }

      return html;
    }

    generateCarouselPillsHtml(today) {
      let html = '';
      for (let i = 0; i < 14; i++) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() + i);

        const isSelected = this.isSameDay(dateObj, this.selectedDate);
        const dayStr = DAY_NAMES[dateObj.getDay()];
        const dateNum = dateObj.getDate();

        html += `
          <div class="date-pill-item ${isSelected ? 'active' : ''}" data-date="${dateObj.toISOString()}">
            <div class="date-pill-day">${dayStr}</div>
            <div class="date-pill-date">${dateNum}</div>
          </div>
        `;
      }
      return html;
    }

    generateTimeSlotsHtml() {
      return DEFAULT_TIME_SLOTS.map(slot => {
        const isSelected = this.selectedSlot === slot.time;
        const isDisabled = slot.status === 'unavailable';
        const isAlmostFull = slot.status === 'almost-full';

        return `
          <button type="button" 
            class="time-slot-btn ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${isAlmostFull ? 'almost-full' : ''}"
            data-slot="${slot.time}"
            ${isDisabled ? 'disabled' : ''}>
            ${slot.time}
            ${isAlmostFull ? '<span class="d-block text-clay" style="font-size:0.65rem; line-height:1;">1 slot left</span>' : ''}
          </button>
        `;
      }).join('');
    }

    bindEvents() {
      // Month navigation
      const btnPrev = this.container.querySelector('.btn-cal-prev');
      const btnNext = this.container.querySelector('.btn-cal-next');

      if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          this.render();
          this.bindEvents();
        });

        btnNext.addEventListener('click', () => {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          this.render();
          this.bindEvents();
        });
      }

      // Day clicks
      this.container.addEventListener('click', (e) => {
        const dayBtn = e.target.closest('.calendar-day-cell:not(.disabled)');
        const pillBtn = e.target.closest('.date-pill-item');

        if (dayBtn || pillBtn) {
          const target = dayBtn || pillBtn;
          const dateStr = target.getAttribute('data-date');
          if (dateStr) {
            this.selectedDate = new Date(dateStr);
            this.selectedSlot = null; // Reset slot on date change
            this.render();
            this.bindEvents();
            this.options.onDateSelect(this.selectedDate);
          }
        }

        // Slot clicks
        const slotBtn = e.target.closest('.time-slot-btn:not(.disabled)');
        if (slotBtn) {
          const slot = slotBtn.getAttribute('data-slot');
          this.selectedSlot = slot;
          this.container.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
          slotBtn.classList.add('selected');
          this.options.onSlotSelect(slot, this.selectedDate);
        }
      });
    }

    formatDisplayDate(date) {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }

    isSameDay(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() &&
             d1.getMonth() === d2.getMonth() &&
             d1.getDate() === d2.getDate();
    }

    getSelected() {
      return {
        date: this.selectedDate,
        dateFormatted: this.formatDisplayDate(this.selectedDate),
        slot: this.selectedSlot
      };
    }
  }

  window.LumeaCalendar = LumeaCalendar;
})();

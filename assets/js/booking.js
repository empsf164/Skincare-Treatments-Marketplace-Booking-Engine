/**
 * LUMÉA - Multi-Step Treatment Booking Engine
 * Guides the client smoothly across Step 1 to Step 6 with live validation and draft persistence.
 */

(function () {
  class BookingEngine {
    constructor() {
      this.currentStep = 1;
      this.totalSteps = 6;
      this.state = {
        treatmentId: 'hydrafacial-md',
        durationMinutes: 60,
        providerId: 'prov-aesthetica-dermal',
        location: 'Bandra West, Mumbai',
        date: new Date(),
        timeSlot: '02:30 PM',
        addons: [],
        customer: {
          fullName: 'Ananya Sharma',
          email: 'ananya.sharma@example.com',
          phone: '+91 98201 54321',
          skinNotes: 'First time Hydrafacial, slightly sensitive cheek area.',
          patchTestAgreed: true
        }
      };

      this.init();
    }

    init() {
      this.loadUrlParamsOrDraft();
      this.renderCurrentStep();
      this.updateSidebarSummary();
      this.bindGlobalStepperButtons();
    }

    loadUrlParamsOrDraft() {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTreatment = urlParams.get('treatment');
      const urlProvider = urlParams.get('provider');

      // Check draft in session
      try {
        const savedDraft = JSON.parse(sessionStorage.getItem('lumea_active_booking_draft'));
        if (savedDraft) {
          if (savedDraft.treatmentId) this.state.treatmentId = savedDraft.treatmentId;
          if (savedDraft.duration) this.state.durationMinutes = Number(savedDraft.duration);
          if (savedDraft.providerId) this.state.providerId = savedDraft.providerId;
          if (savedDraft.addons) this.state.addons = savedDraft.addons.map(a => a.id || a);
        }
      } catch (e) {}

      if (urlTreatment) this.state.treatmentId = urlTreatment;
      if (urlProvider) this.state.providerId = urlProvider;

      // Check user profile for prefill
      try {
        const user = JSON.parse(localStorage.getItem('lumea_auth_user'));
        if (user && user.isLoggedIn) {
          this.state.customer.fullName = user.name || this.state.customer.fullName;
          this.state.customer.email = user.email || this.state.customer.email;
        }
      } catch (e) {}
    }

    goToStep(stepNumber) {
      if (stepNumber < 1 || stepNumber > this.totalSteps) return;

      // Validation before moving forward
      if (stepNumber > this.currentStep) {
        if (!this.validateStep(this.currentStep)) return;
      }

      this.currentStep = stepNumber;
      this.renderCurrentStep();
      this.updateSidebarSummary();
      this.updateStepperUI();

      // Scroll to top of booking area
      const bookingArea = document.getElementById('bookingWorkflowRoot');
      if (bookingArea) {
        bookingArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    validateStep(step) {
      if (step === 1) {
        if (!this.state.treatmentId) {
          window.LumeaNotifications?.warning('Please select a treatment.');
          return false;
        }
        return true;
      }
      if (step === 2 || step === 3) {
        if (!this.state.date) {
          window.LumeaNotifications?.warning('Please select an appointment date.');
          return false;
        }
        if (!this.state.timeSlot) {
          window.LumeaNotifications?.warning('Please select a time slot.');
          return false;
        }
        return true;
      }
      if (step === 5) {
        const name = document.getElementById('custFullName')?.value?.trim();
        const email = document.getElementById('custEmail')?.value?.trim();
        const phone = document.getElementById('custPhone')?.value?.trim();

        if (!name || !email || !phone) {
          window.LumeaNotifications?.error('Please fill in your name, email, and phone.');
          return false;
        }

        this.state.customer.fullName = name;
        this.state.customer.email = email;
        this.state.customer.phone = phone;
        this.state.customer.skinNotes = document.getElementById('custSkinNotes')?.value?.trim() || '';
        return true;
      }
      return true;
    }

    renderCurrentStep() {
      const stepContainer = document.getElementById('stepContentArea');
      if (!stepContainer) return;

      const treatment = window.LumeaTreatments?.getById(this.state.treatmentId);
      const provider = window.LumeaProviders?.getById(this.state.providerId);
      const allTreatments = window.LumeaTreatments?.getAll() || [];
      const allProviders = window.LumeaProviders?.getAll() || [];

      if (this.currentStep === 1) {
        // Step 1: Treatment & Provider Configuration
        stepContainer.innerHTML = `
          <div class="step-card lumea-card p-4">
            <h4 class="mb-1" style="font-family: var(--font-display);">Step 1: Choose Treatment & Specialist</h4>
            <p class="text-muted small mb-4">Select your clinical protocol, preferred provider studio, and appointment duration.</p>

            <div class="mb-4">
              <label class="form-label">Select Treatment Protocol</label>
              <select class="form-select" id="step1TreatmentSelect">
                ${allTreatments.map(t => `
                  <option value="${t.id}" ${t.id === this.state.treatmentId ? 'selected' : ''}>
                    ${t.title} (Starting from ₹${t.startingPrice.toLocaleString()})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label">Select Preferred Specialist / Clinic</label>
              <select class="form-select" id="step1ProviderSelect">
                ${allProviders.map(p => `
                  <option value="${p.id}" ${p.id === this.state.providerId ? 'selected' : ''}>
                    ${p.name} • ${p.location} (★ ${p.rating})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label">Protocol Duration</label>
              <div class="quote-pills-grid" id="step1DurationPills">
                ${(treatment?.durationOptions || [{ duration: 60, label: '60 min Signature', price: treatment?.startingPrice || 5499 }]).map(d => `
                  <button type="button" class="quote-pill-btn ${d.duration === this.state.durationMinutes ? 'active' : ''}" data-duration="${d.duration}">
                    <div class="quote-pill-title">${d.label}</div>
                    <div class="quote-pill-sub">₹${d.price.toLocaleString()}</div>
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4 pt-3 border-top">
              <button type="button" class="btn btn-primary btn-step-next">
                Continue to Date & Slot <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        `;

        // Bind Step 1 change listeners
        stepContainer.querySelector('#step1TreatmentSelect').addEventListener('change', (e) => {
          this.state.treatmentId = e.target.value;
          this.renderCurrentStep();
          this.updateSidebarSummary();
        });

        stepContainer.querySelector('#step1ProviderSelect').addEventListener('change', (e) => {
          this.state.providerId = e.target.value;
          const p = window.LumeaProviders?.getById(this.state.providerId);
          if (p) this.state.location = p.location;
          this.updateSidebarSummary();
        });

        stepContainer.querySelectorAll('#step1DurationPills button').forEach(btn => {
          btn.addEventListener('click', () => {
            this.state.durationMinutes = Number(btn.getAttribute('data-duration'));
            this.renderCurrentStep();
            this.updateSidebarSummary();
          });
        });
      }
      else if (this.currentStep === 2 || this.currentStep === 3) {
        // Step 2 & 3: Calendar & Real-Time Slot
        stepContainer.innerHTML = `
          <div class="step-card lumea-card p-4">
            <h4 class="mb-1" style="font-family: var(--font-display);">Select Date & Real-Time Slot</h4>
            <p class="text-muted small mb-4">Live availability synced with ${provider?.name || 'the clinic'}.</p>

            <div id="bookingCalendarMount"></div>

            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
              <button type="button" class="btn btn-outline-secondary btn-step-prev">
                <i class="bi bi-arrow-left me-1"></i> Back
              </button>
              <button type="button" class="btn btn-primary btn-step-next" ${!this.state.timeSlot ? 'disabled' : ''} id="btnNextFromCalendar">
                Continue to Add-ons <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        `;

        // Mount Calendar
        new window.LumeaCalendar('#bookingCalendarMount', {
          initialDate: this.state.date,
          selectedSlot: this.state.timeSlot,
          onDateSelect: (date) => {
            this.state.date = date;
            this.updateSidebarSummary();
          },
          onSlotSelect: (slot, date) => {
            this.state.timeSlot = slot;
            this.state.date = date;
            this.updateSidebarSummary();
            const nextBtn = document.getElementById('btnNextFromCalendar');
            if (nextBtn) nextBtn.removeAttribute('disabled');
          }
        });
      }
      else if (this.currentStep === 4) {
        // Step 4: Add-ons & Upgrades
        const availableAddons = treatment?.availableAddons || [];
        stepContainer.innerHTML = `
          <div class="step-card lumea-card p-4">
            <h4 class="mb-1" style="font-family: var(--font-display);">Step 4: Enhance Your Treatment</h4>
            <p class="text-muted small mb-4">Select optional clinical upgrades and recovery therapies curated for this protocol.</p>

            <div class="addons-list">
              ${availableAddons.length > 0 ? availableAddons.map(addon => {
                const isSelected = this.state.addons.includes(addon.id);
                return `
                  <div class="quote-addon-item ${isSelected ? 'selected' : ''}" data-addon-id="${addon.id}">
                    <div class="d-flex align-items-center gap-3">
                      <div class="form-check mb-0">
                        <input class="form-check-input" type="checkbox" ${isSelected ? 'checked' : ''} id="addon_check_${addon.id}">
                      </div>
                      <div>
                        <div class="fw-semibold">${addon.name}</div>
                        <div class="text-muted small">+${addon.duration} min duration</div>
                      </div>
                    </div>
                    <div class="fw-bold text-sage">₹${addon.price.toLocaleString()}</div>
                  </div>
                `;
              }).join('') : `
                <div class="p-3 text-muted text-center">No additional add-ons available for this express service.</div>
              `}
            </div>

            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
              <button type="button" class="btn btn-outline-secondary btn-step-prev">
                <i class="bi bi-arrow-left me-1"></i> Back
              </button>
              <button type="button" class="btn btn-primary btn-step-next">
                Continue to Details <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        `;

        // Bind add-on clicks
        stepContainer.querySelectorAll('.quote-addon-item').forEach(item => {
          item.addEventListener('click', (e) => {
            const addonId = item.getAttribute('data-addon-id');
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (this.state.addons.includes(addonId)) {
              this.state.addons = this.state.addons.filter(id => id !== addonId);
              item.classList.remove('selected');
              if (checkbox) checkbox.checked = false;
            } else {
              this.state.addons.push(addonId);
              item.classList.add('selected');
              if (checkbox) checkbox.checked = true;
            }
            this.updateSidebarSummary();
          });
        });
      }
      else if (this.currentStep === 5) {
        // Step 5: Customer Details
        stepContainer.innerHTML = `
          <div class="step-card lumea-card p-4">
            <h4 class="mb-1" style="font-family: var(--font-display);">Step 5: Client Information</h4>
            <p class="text-muted small mb-4">Please provide appointment attendee information for medical intake and reminder alerts.</p>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="custFullName">Full Name *</label>
                <input type="text" class="form-control" id="custFullName" value="${this.state.customer.fullName}" required placeholder="e.g. Ananya Sharma">
              </div>
              <div class="col-md-6">
                <label class="form-label" for="custEmail">Email Address *</label>
                <input type="email" class="form-control" id="custEmail" value="${this.state.customer.email}" required placeholder="name@domain.com">
              </div>
              <div class="col-md-6">
                <label class="form-label" for="custPhone">Phone / WhatsApp Number *</label>
                <input type="tel" class="form-control" id="custPhone" value="${this.state.customer.phone}" required placeholder="+91 98000 00000">
              </div>
              <div class="col-md-6">
                <label class="form-label" for="custGender">Preferences</label>
                <select class="form-select" id="custGender">
                  <option value="no-pref">No preference</option>
                  <option value="female-only">Female Specialist Preferred</option>
                  <option value="quiet-session">Quiet Sensory Experience</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label" for="custSkinNotes">Skin History / Allergies / Notes for Specialist</label>
                <textarea class="form-control" id="custSkinNotes" rows="3" placeholder="Mention any recent chemical peels, retinol usage, allergies, or sensitive areas...">${this.state.customer.skinNotes}</textarea>
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="patchTestConsent" checked>
                  <label class="form-check-label small" for="patchTestConsent">
                    I confirm I have not used prescription oral isotretinoin in the last 6 months and agree to standard clinical hygiene policies.
                  </label>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
              <button type="button" class="btn btn-outline-secondary btn-step-prev">
                <i class="bi bi-arrow-left me-1"></i> Back
              </button>
              <button type="button" class="btn btn-primary btn-step-next">
                Review Summary <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        `;
      }
      else if (this.currentStep === 6) {
        // Step 6: Review Booking Summary
        const quote = this.calculateCurrentQuote();
        stepContainer.innerHTML = `
          <div class="step-card lumea-card p-4">
            <span class="badge-lumea badge-sage mb-2"><i class="bi bi-check-all"></i> Final Review</span>
            <h4 class="mb-1" style="font-family: var(--font-display);">Review Your Appointment</h4>
            <p class="text-muted small mb-4">Please verify the appointment time, specialist location, and payment terms before securing your slot.</p>

            <div class="p-3 bg-surface-subtle rounded-3 mb-4 border">
              <div class="row g-3">
                <div class="col-md-6">
                  <span class="text-muted small d-block">Treatment Protocol</span>
                  <span class="fw-bold">${quote.treatmentTitle} (${quote.durationMinutes} min)</span>
                </div>
                <div class="col-md-6">
                  <span class="text-muted small d-block">Specialist & Clinic</span>
                  <span class="fw-bold">${quote.providerName}</span>
                </div>
                <div class="col-md-6">
                  <span class="text-muted small d-block">Date & Time</span>
                  <span class="fw-bold text-sage"><i class="bi bi-calendar-event me-1"></i>${this.formatDisplayDate(this.state.date)} at ${this.state.timeSlot}</span>
                </div>
                <div class="col-md-6">
                  <span class="text-muted small d-block">Client</span>
                  <span class="fw-bold">${this.state.customer.fullName} • ${this.state.customer.phone}</span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h6 class="mb-2">Transparent Cost Breakdown</h6>
              <div class="quote-breakdown-row">
                <span>Base Clinical Protocol</span>
                <span>₹${quote.basePrice.toLocaleString()}</span>
              </div>
              ${quote.selectedAddons.length > 0 ? quote.selectedAddons.map(a => `
                <div class="quote-breakdown-row">
                  <span>+ ${a.name}</span>
                  <span>₹${a.price.toLocaleString()}</span>
                </div>
              `).join('') : ''}
              <div class="quote-breakdown-row">
                <span>Sterile Clinic Facility Fee</span>
                <span>₹${quote.serviceFee.toLocaleString()}</span>
              </div>
              <div class="quote-breakdown-row total-row">
                <span>Total Appointment Cost</span>
                <span class="text-sage">₹${quote.total.toLocaleString()}</span>
              </div>
            </div>

            <div class="quote-deposit-banner mb-4">
              <div>
                <div style="font-size:0.75rem; text-transform:uppercase;">Deposit Due Today (${quote.depositPercent}%)</div>
                <div style="font-size:1.4rem; font-weight:700;">₹${quote.depositRequired.toLocaleString()}</div>
              </div>
              <div class="text-end">
                <div style="font-size:0.75rem;">Due at Clinic upon Completion</div>
                <div style="font-size:1.1rem; font-weight:600;">₹${quote.balanceRemaining.toLocaleString()}</div>
              </div>
            </div>

            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
              <button type="button" class="btn btn-outline-secondary btn-step-prev">
                <i class="bi bi-arrow-left me-1"></i> Modify
              </button>
              <button type="button" class="btn btn-clay btn-lg" id="btnProceedToDeposit">
                <i class="bi bi-lock-fill me-2"></i>Continue to Secure Deposit (₹${quote.depositRequired.toLocaleString()})
              </button>
            </div>
          </div>
        `;

        stepContainer.querySelector('#btnProceedToDeposit').addEventListener('click', () => {
          this.proceedToPayment();
        });
      }

      this.bindStepButtons(stepContainer);
    }

    calculateCurrentQuote() {
      return window.LumeaQuotes?.calculate({
        treatmentId: this.state.treatmentId,
        durationMinutes: this.state.durationMinutes,
        selectedAddonIds: this.state.addons,
        providerId: this.state.providerId
      });
    }

    updateSidebarSummary() {
      const sidebarContainer = document.getElementById('bookingSidebarSummary');
      if (!sidebarContainer) return;

      const quote = this.calculateCurrentQuote();
      const provider = window.LumeaProviders?.getById(this.state.providerId);

      sidebarContainer.innerHTML = `
        <div class="sticky-booking-sidebar">
          <span class="badge-lumea badge-sand mb-2"><i class="bi bi-shield-check"></i> Verified Reservation</span>
          <h5 class="mb-1" style="font-family: var(--font-display);">${quote.treatmentTitle}</h5>
          <p class="text-muted small mb-3"><i class="bi bi-geo-alt-fill text-sage me-1"></i>${provider?.name || 'Specialist Clinic'}</p>

          <div class="p-2 bg-surface-subtle rounded-2 mb-3 small">
            <div class="d-flex justify-content-between mb-1">
              <span class="text-muted">Date:</span>
              <span class="fw-semibold">${this.formatDisplayDate(this.state.date)}</span>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <span class="text-muted">Time:</span>
              <span class="fw-semibold text-sage">${this.state.timeSlot || 'Not selected'}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">Duration:</span>
              <span class="fw-semibold">${quote.durationMinutes} minutes</span>
            </div>
          </div>

          <div class="small mb-3">
            <div class="d-flex justify-content-between py-1 border-bottom">
              <span class="text-muted">Treatment Base</span>
              <span>₹${quote.basePrice.toLocaleString()}</span>
            </div>
            ${quote.selectedAddons.length > 0 ? `
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span class="text-muted">Add-ons (${quote.selectedAddons.length})</span>
                <span>₹${quote.addonsTotal.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="d-flex justify-content-between py-1 border-bottom">
              <span class="text-muted">Facility Prep Fee</span>
              <span>₹${quote.serviceFee.toLocaleString()}</span>
            </div>
            <div class="d-flex justify-content-between py-2 fw-bold" style="font-size: 1rem;">
              <span>Total Value</span>
              <span class="text-sage">₹${quote.total.toLocaleString()}</span>
            </div>
          </div>

          <div class="p-3 bg-sage-subtle rounded-3 mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="text-muted small" style="font-size: 0.72rem; text-transform:uppercase;">Deposit Due Today</div>
                <div class="fw-bold text-sage" style="font-size: 1.25rem;">₹${quote.depositRequired.toLocaleString()}</div>
              </div>
              <span class="badge-lumea badge-sage">${quote.depositPercent}% Deposit</span>
            </div>
            <div class="text-muted small mt-1" style="font-size: 0.75rem;">
              Remaining ₹${quote.balanceRemaining.toLocaleString()} payable at clinic.
            </div>
          </div>

          <div class="small text-muted text-center">
            <i class="bi bi-clock-history me-1"></i>Free cancellation up to 24 hours in advance.
          </div>
        </div>
      `;
    }

    updateStepperUI() {
      document.querySelectorAll('.booking-stepper .step-item').forEach(item => {
        const stepNum = Number(item.getAttribute('data-step'));
        item.classList.remove('active', 'completed');
        if (stepNum === this.currentStep) {
          item.classList.add('active');
        } else if (stepNum < this.currentStep) {
          item.classList.add('completed');
        }
      });
    }

    bindStepButtons(container) {
      const nextBtn = container.querySelector('.btn-step-next');
      const prevBtn = container.querySelector('.btn-step-prev');

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.goToStep(this.currentStep + 1);
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.goToStep(this.currentStep - 1);
        });
      }
    }

    bindGlobalStepperButtons() {
      document.querySelectorAll('.booking-stepper .step-item').forEach(item => {
        item.addEventListener('click', () => {
          const targetStep = Number(item.getAttribute('data-step'));
          if (targetStep < this.currentStep) {
            this.goToStep(targetStep);
          }
        });
      });
    }

    formatDisplayDate(date) {
      if (!date) return 'Select date';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    proceedToPayment() {
      const quote = this.calculateCurrentQuote();
      const bookingPayload = {
        id: 'LUM-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString(),
        treatmentId: this.state.treatmentId,
        treatmentTitle: quote.treatmentTitle,
        providerId: this.state.providerId,
        providerName: quote.providerName,
        location: this.state.location,
        date: this.state.date.toISOString(),
        dateFormatted: this.formatDisplayDate(this.state.date),
        timeSlot: this.state.timeSlot,
        durationMinutes: this.state.durationMinutes,
        addons: quote.selectedAddons,
        customer: this.state.customer,
        total: quote.total,
        deposit: quote.depositRequired,
        balance: quote.balanceRemaining,
        status: 'pending_payment'
      };

      sessionStorage.setItem('lumea_pending_payment_booking', JSON.stringify(bookingPayload));
      window.location.href = 'payment.html';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bookingWorkflowRoot')) {
      window.LumeaBooking = new BookingEngine();
    }
  });
})();

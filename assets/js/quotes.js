/**
 * LUMÉA - Instant Quote Engine Module
 * Dynamically calculates treatment prices, add-ons, service fees, and deposit requirements.
 */

(function () {
  const SERVICE_FEE = 199; // Standard sterile clinic prep fee in ₹

  function calculateQuote(options) {
    const {
      treatmentId = 'hydrafacial-md',
      durationMinutes = 60,
      selectedAddonIds = [],
      providerId = null,
      skinGoal = 'Hydration'
    } = options;

    const treatment = window.LumeaTreatments?.getById(treatmentId) || {
      startingPrice: 5499,
      durationOptions: [{ duration: 60, price: 5499 }],
      availableAddons: [],
      depositPercent: 20
    };

    // Calculate base price from duration
    const matchedDuration = treatment.durationOptions?.find(d => d.duration === Number(durationMinutes)) || treatment.durationOptions?.[0] || { price: treatment.startingPrice };
    let baseTreatmentPrice = matchedDuration.price;

    // Calculate provider multiplier if selected
    let providerMultiplier = 1.0;
    let providerName = 'Standard Verified Specialist';
    if (providerId && window.LumeaProviders) {
      const prov = window.LumeaProviders.getById(providerId);
      if (prov) {
        providerMultiplier = prov.tierRate || 1.0;
        providerName = prov.name;
      }
    }

    const adjustedBasePrice = Math.round(baseTreatmentPrice * providerMultiplier);

    // Calculate Add-ons
    let addonsTotal = 0;
    const selectedAddonsDetails = [];
    if (treatment.availableAddons && selectedAddonIds.length > 0) {
      treatment.availableAddons.forEach(addon => {
        if (selectedAddonIds.includes(addon.id)) {
          addonsTotal += addon.price;
          selectedAddonsDetails.push(addon);
        }
      });
    }

    const subtotal = adjustedBasePrice + addonsTotal;
    const total = subtotal + SERVICE_FEE;
    const depositPercent = treatment.depositPercent || 20;
    const depositRequired = Math.round((total * depositPercent) / 100);
    const balanceRemaining = total - depositRequired;

    return {
      treatment,
      treatmentTitle: treatment.title,
      durationMinutes,
      skinGoal,
      providerId,
      providerName,
      basePrice: adjustedBasePrice,
      addonsTotal,
      selectedAddons: selectedAddonsDetails,
      serviceFee: SERVICE_FEE,
      total,
      depositPercent,
      depositRequired,
      balanceRemaining
    };
  }

  function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  function renderQuoteSummary(quote, containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
      <div class="quote-breakdown-header mb-3">
        <span class="badge-lumea badge-sage mb-2">Instant Transparent Quote</span>
        <h4 class="mb-1" style="font-family: var(--font-display);">${quote.treatmentTitle}</h4>
        <p class="text-muted small mb-0"><i class="bi bi-clock me-1"></i>${quote.durationMinutes} min • ${quote.skinGoal} Focus • ${quote.providerName}</p>
      </div>

      <div class="quote-breakdown-rows">
        <div class="quote-breakdown-row">
          <span>Base Clinical Protocol</span>
          <span class="fw-semibold">${formatCurrency(quote.basePrice)}</span>
        </div>
        ${quote.selectedAddons.length > 0 ? quote.selectedAddons.map(a => `
          <div class="quote-breakdown-row">
            <span>+ ${a.name}</span>
            <span class="fw-semibold">${formatCurrency(a.price)}</span>
          </div>
        `).join('') : ''}
        <div class="quote-breakdown-row">
          <span>Sterile Facility & Prep Fee</span>
          <span class="fw-semibold">${formatCurrency(quote.serviceFee)}</span>
        </div>
        <div class="quote-breakdown-row total-row">
          <span>Estimated Total</span>
          <span class="text-sage">${formatCurrency(quote.total)}</span>
        </div>
      </div>

      <div class="quote-deposit-banner">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.9;">Deposit Due Today (${quote.depositPercent}%)</div>
          <div style="font-size: 1.35rem; font-weight: 700;">${formatCurrency(quote.depositRequired)}</div>
        </div>
        <div class="text-end">
          <div style="font-size: 0.75rem; opacity: 0.9;">Pay at Clinic</div>
          <div style="font-size: 1.05rem; font-weight: 600;">${formatCurrency(quote.balanceRemaining)}</div>
        </div>
      </div>

      <div class="mt-4">
        <button type="button" class="btn btn-primary w-100 btn-lg btn-proceed-booking" id="btnQuoteProceed">
          <i class="bi bi-calendar-check me-2"></i>Check Availability & Book
        </button>
        <div class="text-center mt-2 text-muted" style="font-size: 0.78rem;">
          <i class="bi bi-shield-check text-sage me-1"></i>Free cancellation up to 24h prior. No hidden fees.
        </div>
      </div>
    `;

    const btn = containerElement.querySelector('#btnQuoteProceed');
    if (btn) {
      btn.addEventListener('click', () => {
        // Save current quote configuration to session storage for smooth booking flow
        const bookingDraft = {
          treatmentId: quote.treatment.id,
          treatmentTitle: quote.treatment.title,
          duration: quote.durationMinutes,
          skinGoal: quote.skinGoal,
          providerId: quote.providerId,
          addons: quote.selectedAddons,
          total: quote.total,
          deposit: quote.depositRequired,
          balance: quote.balanceRemaining
        };
        sessionStorage.setItem('lumea_active_booking_draft', JSON.stringify(bookingDraft));
        window.location.href = `booking.html?treatment=${quote.treatment.id}&provider=${quote.providerId || ''}`;
      });
    }
  }

  window.LumeaQuotes = {
    calculate: calculateQuote,
    formatCurrency: formatCurrency,
    renderSummary: renderQuoteSummary
  };
})();

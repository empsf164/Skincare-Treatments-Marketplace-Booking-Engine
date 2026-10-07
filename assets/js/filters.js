/**
 * LUMÉA - Marketplace Filters & View Engine
 * Manages category pills, concern filters, price range, sorting, and dynamic grid rendering.
 */

(function () {
  function initTreatmentsMarketplace() {
    const listMount = document.getElementById('treatmentsGridMount');
    if (!listMount) return;

    let currentFilters = {
      query: '',
      category: 'All',
      concern: 'All',
      maxPrice: 20000,
      sort: 'recommended'
    };

    // Read URL query params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('q')) currentFilters.query = urlParams.get('q');
    if (urlParams.get('category')) currentFilters.category = urlParams.get('category');
    if (urlParams.get('concern')) currentFilters.concern = urlParams.get('concern');

    const searchInput = document.getElementById('treatmentFilterSearch');
    if (searchInput && currentFilters.query) searchInput.value = currentFilters.query;

    function render() {
      const items = window.LumeaTreatments?.filter(
        currentFilters.query,
        currentFilters.category,
        currentFilters.concern,
        currentFilters.maxPrice,
        currentFilters.sort
      ) || [];

      const countLabel = document.getElementById('treatmentsCountLabel');
      if (countLabel) {
        countLabel.textContent = `Showing ${items.length} clinical treatments`;
      }

      if (items.length === 0) {
        listMount.innerHTML = `
          <div class="col-12">
            <div class="lumea-card text-center p-5">
              <i class="bi bi-funnel text-muted mb-3 d-block" style="font-size:2.5rem;"></i>
              <h4 style="font-family: var(--font-display);">No treatments match your filter</h4>
              <p class="text-muted small mb-4">Try resetting your filters or searching for another skin goal.</p>
              <button type="button" class="btn btn-secondary btn-sm" id="btnResetAllFilters">Reset Filters</button>
            </div>
          </div>
        `;

        listMount.querySelector('#btnResetAllFilters')?.addEventListener('click', () => {
          currentFilters = { query: '', category: 'All', concern: 'All', maxPrice: 20000, sort: 'recommended' };
          if (searchInput) searchInput.value = '';
          document.querySelectorAll('.filter-category-chip').forEach(c => c.classList.remove('active'));
          document.querySelector('.filter-category-chip[data-category="All"]')?.classList.add('active');
          render();
        });
        return;
      }

      listMount.innerHTML = items.map(t => `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="treatment-card">
            <div class="treatment-card-img-wrap">
              <img src="${t.image}" alt="${t.title}" loading="lazy">
              <span class="treatment-card-badge badge-lumea badge-sage">${t.category}</span>
              <button type="button" class="treatment-fav-btn" data-fav-type="treatments" data-fav-id="${t.id}" data-fav-title="${t.title}" aria-label="Save treatment">
                <i class="bi bi-heart"></i>
              </button>
            </div>
            <div class="treatment-card-body">
              <div class="treatment-meta-chips">
                <span><i class="bi bi-clock me-1"></i>${t.duration} min</span>
                <span>•</span>
                <span class="badge-rating"><i class="bi bi-star-fill me-1"></i>${t.rating} (${t.reviewsCount})</span>
              </div>
              <h4 class="treatment-title"><a href="treatment-details.html?id=${t.id}">${t.title}</a></h4>
              <p class="treatment-desc">${t.shortDesc}</p>
              
              <div class="d-flex flex-wrap gap-1 mb-3">
                ${t.concern.slice(0, 3).map(c => `<span class="badge-lumea badge-sand" style="font-size:0.7rem; padding:0.15rem 0.5rem;">${c}</span>`).join('')}
              </div>

              <div class="treatment-card-footer">
                <div class="price-box">
                  <span class="price-label">Starting From</span>
                  <span class="price-value">₹${t.startingPrice.toLocaleString()}</span>
                </div>
                <a href="treatment-details.html?id=${t.id}" class="btn btn-sm btn-primary">
                  View & Quote <i class="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      if (window.LumeaFavorites) {
        window.LumeaFavorites.updateUI();
      }
    }

    // Bind event listeners
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentFilters.query = e.target.value.trim();
        render();
      });
    }

    document.querySelectorAll('.filter-category-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-category-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilters.category = chip.getAttribute('data-category');
        render();
      });
    });

    const concernSelect = document.getElementById('filterConcernSelect');
    if (concernSelect) {
      concernSelect.addEventListener('change', (e) => {
        currentFilters.concern = e.target.value;
        render();
      });
    }

    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        render();
      });
    }

    const priceRangeInput = document.getElementById('filterPriceRange');
    const priceRangeLabel = document.getElementById('filterPriceValueLabel');
    if (priceRangeInput && priceRangeLabel) {
      priceRangeInput.addEventListener('input', (e) => {
        currentFilters.maxPrice = Number(e.target.value);
        priceRangeLabel.textContent = `₹${currentFilters.maxPrice.toLocaleString()}`;
        render();
      });
    }

    render();
  }

  function initProvidersMarketplace() {
    const listMount = document.getElementById('providersGridMount');
    if (!listMount) return;

    let currentFilters = {
      query: '',
      type: 'All',
      location: 'All Locations',
      sort: 'recommended'
    };

    const searchInput = document.getElementById('providerFilterSearch');

    function render() {
      const items = window.LumeaProviders?.filter(
        currentFilters.query,
        currentFilters.type,
        currentFilters.location,
        currentFilters.sort
      ) || [];

      const countLabel = document.getElementById('providersCountLabel');
      if (countLabel) {
        countLabel.textContent = `Showing ${items.length} verified dermatology clinics & skin specialists`;
      }

      if (items.length === 0) {
        listMount.innerHTML = `
          <div class="col-12">
            <div class="lumea-card text-center p-5">
              <i class="bi bi-geo-alt text-muted mb-3 d-block" style="font-size:2.5rem;"></i>
              <h4 style="font-family: var(--font-display);">No providers found</h4>
              <p class="text-muted small mb-4">Try clearing your search query or selecting another location.</p>
            </div>
          </div>
        `;
        return;
      }

      listMount.innerHTML = items.map(p => `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="provider-card">
            <div class="provider-card-header">
              <img src="${p.heroImage}" alt="${p.name}" loading="lazy">
              <div class="provider-avatar-overlay" title="${p.specialistName}">
                <img src="${p.avatar}" alt="${p.specialistName}">
              </div>
            </div>
            <div class="provider-card-body">
              <div class="d-flex justify-content-end align-items-center gap-2 mb-2" style="min-height: 28px;">
                <span class="badge-lumea badge-verified"><i class="bi bi-patch-check-fill"></i> Verified</span>
                <span class="badge-rating"><i class="bi bi-star-fill me-1"></i>${p.rating} (${p.reviewsCount})</span>
              </div>
              <h4 class="provider-name mt-1"><a href="provider-profile.html?id=${p.id}">${p.name}</a></h4>
              <div class="provider-location"><i class="bi bi-geo-alt-fill text-sage me-1"></i>${p.location}</div>
              <p class="text-muted small mb-3" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.bio}</p>

              <div class="provider-slot-badge mb-3">
                <i class="bi bi-lightning-charge-fill text-sage"></i> Next slot: ${p.nextAvailableSlot}
              </div>

              <div class="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                <div>
                  <div class="price-label">Treatments from</div>
                  <div class="fw-bold text-sage">₹${p.startingPrice.toLocaleString()}</div>
                </div>
                <a href="provider-profile.html?id=${p.id}" class="btn btn-sm btn-outline-primary">
                  View Profile & Book
                </a>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentFilters.query = e.target.value.trim();
        render();
      });
    }

    const typeSelect = document.getElementById('providerTypeFilter');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        currentFilters.type = e.target.value;
        render();
      });
    }

    const sortSelect = document.getElementById('providerSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        render();
      });
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTreatmentsMarketplace();
    initProvidersMarketplace();
  });
})();

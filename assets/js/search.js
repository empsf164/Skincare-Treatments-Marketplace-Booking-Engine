/**
 * LUMÉA - Global Categorized Search Engine Overlay
 * Live search across Treatments, Providers, and Skincare Journal articles.
 */

(function () {
  const RECENT_SEARCHES_KEY = 'lumea_recent_searches';

  const JOURNAL_DATA = [
    {
      id: 'guide-hydrafacial-vs-micro',
      title: 'Hydrafacial vs. Microneedling: Which Is Right for Your Skin Goals?',
      category: 'Treatment Guides',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
      url: 'resource-details.html?id=guide-hydrafacial-vs-micro'
    },
    {
      id: 'guide-chemical-peel-prep',
      title: 'Pre & Post-Peel Protocols: Maximizing Results While Protecting the Barrier',
      category: 'Aftercare',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
      url: 'resource-details.html?id=guide-chemical-peel-prep'
    },
    {
      id: 'guide-exosomes-skincare',
      title: 'The Science of Exosomes in Advanced Collagen Induction Therapy',
      category: 'Ingredient Guides',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
      url: 'resource-details.html?id=guide-exosomes-skincare'
    }
  ];

  function getRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || ['Hydrafacial MD', 'BioRePeel', 'Acne Facial', 'Bandra Clinic'];
    } catch (e) {
      return ['Hydrafacial MD', 'BioRePeel', 'Acne Facial'];
    }
  }

  function addRecentSearch(query) {
    if (!query) return;
    let list = getRecentSearches();
    list = [query, ...list.filter(q => q.toLowerCase() !== query.toLowerCase())].slice(0, 6);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list));
  }

  function clearRecentSearches() {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }

  class SearchOverlay {
    constructor() {
      this.modal = null;
      this.input = null;
      this.resultsContainer = null;
      this.init();
    }

    init() {
      this.createOverlayDom();
      this.bindTriggers();
    }

    createOverlayDom() {
      if (document.getElementById('globalSearchOverlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'globalSearchOverlay';
      overlay.className = 'search-overlay-modal';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Global Search');

      overlay.innerHTML = `
        <div class="search-overlay-card">
          <div class="search-input-header">
            <i class="bi bi-search"></i>
            <input type="text" class="search-input-field" id="globalSearchInputField" placeholder="Search treatments, providers, concerns, or journal..." autocomplete="off">
            <button type="button" class="btn-close" id="btnCloseSearchOverlay" aria-label="Close search"></button>
          </div>
          <div class="search-results-body" id="globalSearchResultsMount">
            <!-- Rendered dynamically -->
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.modal = overlay;
      this.input = overlay.querySelector('#globalSearchInputField');
      this.resultsContainer = overlay.querySelector('#globalSearchResultsMount');

      this.renderDefaultState();

      // Close events
      overlay.querySelector('#btnCloseSearchOverlay').addEventListener('click', () => this.close());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });

      // Live search typing
      this.input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 0) {
          this.executeSearch(query);
        } else {
          this.renderDefaultState();
        }
      });

      // Enter key
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = this.input.value.trim();
          if (q) {
            addRecentSearch(q);
            window.location.href = `treatments.html?q=${encodeURIComponent(q)}`;
          }
        } else if (e.key === 'Escape') {
          this.close();
        }
      });
    }

    renderDefaultState() {
      const recent = getRecentSearches();
      this.resultsContainer.innerHTML = `
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="search-result-group-title mb-0">Recent & Popular Searches</span>
            ${recent.length > 0 ? '<button class="btn btn-link p-0 text-muted small" id="btnClearRecentSearch" style="font-size:0.75rem; text-decoration:none;">Clear</button>' : ''}
          </div>
          <div class="search-quick-tags">
            ${recent.map(r => `<span class="search-tag-chip" data-query="${r}"><i class="bi bi-clock-history me-1"></i>${r}</span>`).join('')}
          </div>
        </div>

        <div>
          <span class="search-result-group-title">Trending Skincare Goals</span>
          <div class="search-quick-tags">
            <span class="search-tag-chip" data-query="Acne"><i class="bi bi-stars me-1 text-clay"></i>Acne & Breakouts</span>
            <span class="search-tag-chip" data-query="Hydration"><i class="bi bi-droplet-fill me-1 text-sage"></i>Barrier Hydration</span>
            <span class="search-tag-chip" data-query="Brightening"><i class="bi bi-brightness-high-fill me-1 text-sand"></i>Glow & Brightening</span>
            <span class="search-tag-chip" data-query="Microneedling"><i class="bi bi-bullseye me-1 text-sage"></i>Collagen Induction</span>
          </div>
        </div>
      `;

      // Bind chip clicks
      this.resultsContainer.querySelectorAll('.search-tag-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const q = chip.getAttribute('data-query');
          this.input.value = q;
          this.executeSearch(q);
        });
      });

      const btnClear = this.resultsContainer.querySelector('#btnClearRecentSearch');
      if (btnClear) {
        btnClear.addEventListener('click', () => {
          clearRecentSearches();
          this.renderDefaultState();
        });
      }
    }

    executeSearch(query) {
      const treatments = window.LumeaTreatments?.filter(query) || [];
      const providers = window.LumeaProviders?.filter(query) || [];
      const articles = JOURNAL_DATA.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      );

      const totalMatches = treatments.length + providers.length + articles.length;

      if (totalMatches === 0) {
        this.resultsContainer.innerHTML = `
          <div class="text-center py-4 text-muted">
            <i class="bi bi-search mb-2 d-block" style="font-size: 1.8rem;"></i>
            <div class="fw-semibold">No direct matches found for "${query}"</div>
            <div class="small mt-1">Try searching for "Hydrafacial", "Peel", "Acne", or a provider location like "Bandra".</div>
          </div>
        `;
        return;
      }

      let html = '';

      // Treatments group
      if (treatments.length > 0) {
        html += `
          <div class="mb-3">
            <div class="search-result-group-title">Treatments (${treatments.length})</div>
            ${treatments.slice(0, 3).map(t => `
              <a href="treatment-details.html?id=${t.id}" class="search-result-item">
                <img src="${t.image}" alt="${t.title}" class="search-result-thumb">
                <div class="flex-grow-1">
                  <div class="fw-semibold" style="font-size:0.92rem;">${t.title}</div>
                  <div class="text-muted small">${t.duration} min • Starting ₹${t.startingPrice.toLocaleString()} • ★ ${t.rating}</div>
                </div>
                <i class="bi bi-chevron-right text-muted small"></i>
              </a>
            `).join('')}
          </div>
        `;
      }

      // Providers group
      if (providers.length > 0) {
        html += `
          <div class="mb-3">
            <div class="search-result-group-title">Specialists & Clinics (${providers.length})</div>
            ${providers.slice(0, 2).map(p => `
              <a href="provider-profile.html?id=${p.id}" class="search-result-item">
                <img src="${p.avatar}" alt="${p.name}" class="search-result-thumb" style="border-radius:50%;">
                <div class="flex-grow-1">
                  <div class="fw-semibold" style="font-size:0.92rem;">${p.name} <i class="bi bi-patch-check-fill text-success" style="font-size:0.8rem;"></i></div>
                  <div class="text-muted small">${p.location} • ★ ${p.rating} (${p.reviewsCount} reviews)</div>
                </div>
                <i class="bi bi-chevron-right text-muted small"></i>
              </a>
            `).join('')}
          </div>
        `;
      }

      // Articles group
      if (articles.length > 0) {
        html += `
          <div>
            <div class="search-result-group-title">Journal Articles (${articles.length})</div>
            ${articles.slice(0, 2).map(a => `
              <a href="${a.url}" class="search-result-item">
                <img src="${a.image}" alt="${a.title}" class="search-result-thumb">
                <div class="flex-grow-1">
                  <div class="fw-semibold" style="font-size:0.92rem;">${a.title}</div>
                  <div class="text-muted small">${a.category} • ${a.readTime}</div>
                </div>
                <i class="bi bi-chevron-right text-muted small"></i>
              </a>
            `).join('')}
          </div>
        `;
      }

      this.resultsContainer.innerHTML = html;
    }

    open() {
      if (this.modal) {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          if (this.input) this.input.focus();
        }, 150);
      }
    }

    close() {
      if (this.modal) {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    bindTriggers() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.btn-search-trigger, [data-open-search]');
        if (trigger) {
          e.preventDefault();
          this.open();
        }
      });

      // Keyboard shortcut (Ctrl+K or /)
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.open();
        } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.open();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.LumeaSearch = new SearchOverlay();
  });
})();

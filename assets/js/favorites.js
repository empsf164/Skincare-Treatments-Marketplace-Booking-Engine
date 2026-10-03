/**
 * LUMÉA - Bookmark & Favorites System
 */

(function () {
  const FAVORITES_KEY = 'lumea_user_favorites';

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || { treatments: [], providers: [], articles: [] };
    } catch (e) {
      return { treatments: [], providers: [], articles: [] };
    }
  }

  function saveFavorites(data) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
    updateFavoritesBadge();
  }

  function toggleFavorite(type, id, itemData = {}) {
    const favs = getFavorites();
    if (!favs[type]) favs[type] = [];

    const index = favs[type].findIndex(item => (typeof item === 'object' ? item.id === id : item === id));
    let isSaved = false;

    if (index > -1) {
      favs[type].splice(index, 1);
      isSaved = false;
      if (window.LumeaNotifications) {
        window.LumeaNotifications.info(`Removed from your saved ${type}`);
      }
    } else {
      favs[type].push({ id, ...itemData, savedAt: new Date().toISOString() });
      isSaved = true;
      if (window.LumeaNotifications) {
        window.LumeaNotifications.success(`Saved to your collection!`, 3500);
      }
    }

    saveFavorites(favs);
    updateButtonStates();
    return isSaved;
  }

  function isFavorite(type, id) {
    const favs = getFavorites();
    if (!favs[type]) return false;
    return favs[type].some(item => (typeof item === 'object' ? item.id === id : item === id));
  }

  function getTotalFavoritesCount() {
    const favs = getFavorites();
    return (favs.treatments?.length || 0) + (favs.providers?.length || 0) + (favs.articles?.length || 0);
  }

  function updateFavoritesBadge() {
    const count = getTotalFavoritesCount();
    document.querySelectorAll('.fav-counter-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function updateButtonStates() {
    document.querySelectorAll('[data-fav-type][data-fav-id]').forEach(btn => {
      const type = btn.getAttribute('data-fav-type');
      const id = btn.getAttribute('data-fav-id');
      const active = isFavorite(type, id);

      if (active) {
        btn.classList.add('active');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-heart-fill text-danger';
        }
        btn.setAttribute('aria-label', 'Remove from saved');
      } else {
        btn.classList.remove('active');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-heart';
        }
        btn.setAttribute('aria-label', 'Save to collection');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesBadge();
    updateButtonStates();

    document.addEventListener('click', (e) => {
      const favBtn = e.target.closest('[data-fav-type][data-fav-id]');
      if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        const type = favBtn.getAttribute('data-fav-type');
        const id = favBtn.getAttribute('data-fav-id');
        const title = favBtn.getAttribute('data-fav-title') || id;
        toggleFavorite(type, id, { title });
      }
    });
  });

  window.LumeaFavorites = {
    get: getFavorites,
    toggle: toggleFavorite,
    isFavorite: isFavorite,
    count: getTotalFavoritesCount,
    updateUI: () => {
      updateFavoritesBadge();
      updateButtonStates();
    }
  };
})();

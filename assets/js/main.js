/**
 * ============================================================
 *  YONO APPS — Public Frontend
 * ------------------------------------------------------------
 *  Developed by : hatela
 *  Telegram      : @hatela_owner
 *  Contact       : https://t.me/hatela_owner
 * ------------------------------------------------------------
 *  Unauthorized resale without credit is prohibited.
 *  If you purchased this script, verify authenticity at:
 *  https://t.me/hatela_owner
 * ============================================================
 */
/* main.js – YONO APPS Public Frontend */

console.log(
  '%c YONO APPS ',
  'background:#11999E;color:#fff;font-size:14px;font-weight:bold;padding:4px 10px;border-radius:4px;',
  '\n%cDeveloped by hatela | t.me/hatela_owner',
  'color:#11999E;font-weight:600;'
);

document.addEventListener('DOMContentLoaded', () => {
  logVisit();
  initSearch();
  initScrollReveal();
});

/* ── Visit Tracking (unique per browser per 24h) ──────────── */
function logVisit() {
  const KEY      = 'yono_visited';
  const HOURS_24 = 24 * 60 * 60 * 1000;
  const last     = parseInt(localStorage.getItem(KEY) || '0', 10);
  const now      = Date.now();

  // If same browser visited within last 24 hours, skip request
  if (now - last < HOURS_24) return;

  fetch('/backend/stats.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=log_visit'
  })
  .then(r => r.json())
  .then(data => {
    // Only stamp localStorage if server actually recorded it
    if (data.success && data.message === 'Visit logged.') {
      localStorage.setItem(KEY, now.toString());
    }
  })
  .catch(() => {});
}

/* ── Live Search ────────────────────────────────────────────── */
function initSearch() {
  const inputs = document.querySelectorAll('.search-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      inputs.forEach(i => { if (i !== input) i.value = input.value; });
      filterCards(q);
    });
  });
}

function filterCards(q) {
  document.querySelectorAll('.app-card').forEach(card => {
    const match = q === '' || (card.dataset.name || '').toLowerCase().includes(q);
    card.style.display = match ? '' : 'none';
  });

  document.querySelectorAll('.apps-section').forEach(section => {
    const grid    = section.querySelector('.apps-grid');
    if (!grid) return;
    const visible = [...grid.querySelectorAll('.app-card')].filter(c => c.style.display !== 'none');
    let noRes = grid.querySelector('.no-results');
    if (!noRes) { noRes = document.createElement('p'); noRes.className = 'no-results'; noRes.textContent = 'No apps match your search.'; grid.appendChild(noRes); }
    noRes.classList.toggle('show', visible.length === 0);
  });
}

/* ── Scroll Reveal ──────────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 55);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.app-card').forEach(c => observer.observe(c));
}

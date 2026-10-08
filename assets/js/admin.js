/**
 * ============================================================
 *  YONO APPS — Admin Panel
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
/* admin.js – YONO APPS Admin Panel */

console.log(
  '%c YONO APPS ADMIN ',
  'background:#11999E;color:#fff;font-size:14px;font-weight:bold;padding:4px 10px;border-radius:4px;',
  '\n%cDeveloped by hatela | t.me/hatela_owner',
  'color:#11999E;font-weight:600;'
);

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  let t = document.getElementById('adminToast');
  if (!t) { t = document.createElement('div'); t.id = 'adminToast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = `toast ${type}`;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── Sidebar ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const ham     = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('show'); }
  ham?.addEventListener('click', () => { sidebar?.classList.toggle('open'); overlay?.classList.toggle('show'); });
  overlay?.addEventListener('click', closeSidebar);

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (!confirm('Logout?')) return;
    fetch('/backend/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'action=logout' })
      .then(() => window.location.href = '/admin/login.php');
  });
});

/* ── AJAX ───────────────────────────────────────────────────── */
async function postForm(url, data) {
  const isFormData = data instanceof FormData;
  const res = await fetch(url, {
    method: 'POST',
    headers: isFormData ? {} : { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: isFormData ? data : Object.entries(data).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
  });
  return res.json();
}

/* ── Image Preview ──────────────────────────────────────────── */
function initUploadPreview(inputId, previewId, areaId) {
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const area    = document.getElementById(areaId);
  if (!input || !preview) return;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { preview.src = e.target.result; preview.classList.add('show'); };
    reader.readAsDataURL(file);
  });

  if (area) {
    area.addEventListener('dragover',  e => { e.preventDefault(); area.classList.add('dragover'); });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', e => {
      e.preventDefault(); area.classList.remove('dragover');
      if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); }
    });
  }
}

/* ── Upload icon ────────────────────────────────────────────── */
async function uploadIcon(fileInput) {
  if (!fileInput?.files[0]) return '';
  const fd = new FormData();
  fd.append('icon', fileInput.files[0]);
  const res = await postForm('/backend/upload.php', fd);
  if (res.success) return res.data.filename;
  throw new Error(res.message || 'Upload failed');
}

/* ── Modal ──────────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id)?.classList.add('show'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show');
  if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
    e.target.closest('.modal-overlay')?.classList.remove('show');
  }
});

/* ── SortableJS reorder ─────────────────────────────────────── */
function initSortable(listId) {
  const el = document.getElementById(listId);
  if (!el || typeof Sortable === 'undefined') return;
  Sortable.create(el, {
    handle: '.drag-handle', animation: 180,
    ghostClass: 'sortable-ghost', chosenClass: 'sortable-chosen',
    onEnd: async () => {
      const ids = [...el.querySelectorAll('.manage-app-item')].map(i => i.dataset.id);
      const res = await postForm('/backend/app.php', { action: 'reorder', order: JSON.stringify(ids) });
      showToast(res.success ? 'Order saved' : res.message, res.success ? 'success' : 'error');
    }
  });
}

/* ── Delete App ─────────────────────────────────────────────── */
async function deleteApp(id, name) {
  if (!confirm(`Delete "${name}"?`)) return;
  const res = await postForm('/backend/app.php', { action: 'delete', id });
  if (res.success) {
    document.querySelector(`.manage-app-item[data-id="${id}"]`)?.remove();
    showToast('App deleted');
  } else { showToast(res.message, 'error'); }
}

/* ── Edit Modal ─────────────────────────────────────────────── */
function openEditModal(app) {
  const m = document.getElementById('editModal');
  if (!m) return;
  m.querySelector('#edit-id').value        = app.id;
  m.querySelector('#edit-name').value      = app.name;
  m.querySelector('#edit-link').value      = app.link;
  m.querySelector('#edit-bonus').value     = app.bonus;
  m.querySelector('#edit-withdraw').value  = app.withdraw;
  m.querySelector('#edit-downloads').value = app.downloads;
  m.querySelector('#edit-rating').value    = app.rating;
  m.querySelector('#edit-size').value      = app.size;
  m.querySelector('#edit-category').value  = app.category;
  m.querySelector('#edit-featured').checked = !!app.featured;
  m.querySelector('#edit-current-icon').value = app.icon || '';
  const prev = m.querySelector('#editPreview');
  if (prev) { prev.src = app.icon ? '/assets/images/' + app.icon : ''; prev.classList.toggle('show', !!app.icon); }
  openModal('editModal');
}

/* ── Submit Edit ────────────────────────────────────────────── */
async function submitEditForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('[type=submit]');
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Saving…';

  try {
    const fileInput = form.querySelector('#edit-icon-file');
    let icon = form.querySelector('#edit-current-icon').value;
    if (fileInput?.files[0]) icon = await uploadIcon(fileInput);

    const data = {
      action:    'edit',
      id:        form.querySelector('#edit-id').value,
      name:      form.querySelector('#edit-name').value,
      link:      form.querySelector('#edit-link').value,
      bonus:     form.querySelector('#edit-bonus').value,
      withdraw:  form.querySelector('#edit-withdraw').value,
      downloads: form.querySelector('#edit-downloads').value,
      rating:    form.querySelector('#edit-rating').value,
      size:      form.querySelector('#edit-size').value,
      category:  form.querySelector('#edit-category').value,
      featured:  form.querySelector('#edit-featured').checked ? '1' : '0',
      icon
    };
    const res = await postForm('/backend/app.php', data);
    if (res.success) { showToast('App updated'); setTimeout(() => location.reload(), 800); }
    else { showToast(res.message, 'error'); btn.disabled = false; btn.innerHTML = originalHTML; }
  } catch(err) { showToast(err.message || 'Error', 'error'); btn.disabled = false; btn.innerHTML = originalHTML; }
}

/* ── Tab switching ──────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(p => { p.style.display = p.dataset.tab === tab ? '' : 'none'; });
    });
  });
}

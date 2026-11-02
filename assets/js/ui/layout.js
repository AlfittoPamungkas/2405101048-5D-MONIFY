// Fungsi bantu tampilan: pesan flash, modal, isi <select>, dan inisialisasi layout.
// TIDAK ada HTML di sini — sidebar/topbar sudah ada di file .html, JS hanya mengisinya.
(function (M) {
  const { $, $$, S, save, user, tgl, iso, NOW, CY, ini, budgetRows } = M;

  // Pesan sukses/error di <div id="fl"></div>
  const flash = (type, msg) => {
    const box = $('#fl'); if (!box) return;
    box.innerHTML = '';
    const d = document.createElement('div');
    d.className = 'flash flash-' + type; d.setAttribute('role', 'alert'); d.textContent = msg;
    box.appendChild(d);
    if (type === 'success') setTimeout(() => { box.innerHTML = ''; }, 4000);
  };
  // Simpan pesan, lalu pindah halaman (pesan muncul di halaman tujuan)
  const goFlash = (type, msg, url) => { S.flash = { type, msg }; save(); location.href = url; };
  const showStoredFlash = () => { if (S.flash) { flash(S.flash.type, S.flash.msg); S.flash = null; save(); } };

  const openModal = id => {
    const m = document.getElementById(id); m.hidden = false; document.body.classList.add('modal-open');
    const f = m.querySelector('input:not([type=hidden]):not([type=radio]), select, textarea'); if (f) setTimeout(() => f.focus(), 40);
  };
  const closeModal = m => { if (!m) return; m.hidden = true; if (!$('.modal:not([hidden])')) document.body.classList.remove('modal-open'); };
  const icons = () => window.lucide && lucide.createIcons();

  // Isi <select>. items = [[value, teks, disabled?], ...]
  const fillSelect = (sel, items, selected) => {
    sel.innerHTML = '';
    items.forEach(([v, t, off]) => { const o = new Option(t, v); o.disabled = !!off; sel.add(o); });
    if (selected != null) sel.value = selected;
  };
  const fillCats = (sel, type, selected) => fillSelect(sel, S.cats.filter(c => c.type === type).sort((a, b) => a.name.localeCompare(b.name)).map(c => [c.id, c.name]), selected);
  const fillYears = (sel, selected) => fillSelect(sel, Array.from({ length: 6 }, (_, i) => CY + 1 - i).map(y => [y, y]), selected);

  // Dipanggil di awal setiap halaman yang butuh login. Return false jika belum login.
  function initLayout() {
    if (!S.uid || !user()) { location.replace('login.html'); return false; }
    const u = user();
    $$('.js-initials').forEach(el => el.textContent = ini(u.name));
    $$('.js-name').forEach(el => el.textContent = u.name);
    $$('.js-email').forEach(el => el.textContent = u.email);
    $('#todayDate').textContent = tgl(iso(NOW));
    const alerts = budgetRows(NOW.getMonth() + 1, CY).filter(b => b.pct >= 80).length;
    $('#bellDot').hidden = !alerts;
    $('#bell').title = alerts ? alerts + ' anggaran perlu perhatian' : 'Tidak ada peringatan';

    const toggle = () => document.body.classList.toggle('sidebar-open');
    $('#menuBtn').addEventListener('click', toggle); $('#backdrop').addEventListener('click', toggle);
    $('#logoutBtn').addEventListener('click', () => { S.uid = null; goFlash('success', 'Anda telah keluar.', 'login.html'); });

    // Tutup modal: tombol [data-close], klik area gelap, atau tombol Esc
    document.addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target.classList.contains('modal')) closeModal(e.target.closest('.modal')); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal:not([hidden])').forEach(closeModal); });
    showStoredFlash(); icons();
    return true;
  }
  Object.assign(M, { flash, goFlash, showStoredFlash, openModal, closeModal, icons, fillSelect, fillCats, fillYears, initLayout });
})(window.Monify = window.Monify || {});

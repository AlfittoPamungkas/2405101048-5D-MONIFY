// Helper umum: format rupiah/tanggal, DOM, tanggal sekarang.
(function (M) {
  const B = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const ago = n => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d); };
  const tgl = s => { const [y, m, d] = s.split('-'); return +d + ' ' + B[m - 1] + ' ' + y; };
  const ini = n => { const p = n.trim().split(/\s+/); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); };
  const NOW = new Date(), CM = NOW.getMonth() + 1, CY = NOW.getFullYear();
  const mrange = (m, y) => [iso(new Date(y, m - 1, 1)), iso(new Date(y, m, 0))];
  const fd = f => Object.fromEntries(new FormData(f));
  // Ambil salinan isi <template id="..."> dari HTML
  const tpl = id => document.getElementById(id).content.firstElementChild.cloneNode(true);
  // Isi teks elemen ber-class "js-nama" di dalam root. Contoh: setText(row, { nama: 'Budi' })
  const setText = (root, map) => Object.entries(map).forEach(([k, v]) => { const el = root.querySelector('.js-' + k); if (el) el.textContent = v; });
  Object.assign(M, { B, $, $$, esc, rp, iso, ago, tgl, ini, NOW, CM, CY, mrange, fd, tpl, setText });
})(window.Monify = window.Monify || {});

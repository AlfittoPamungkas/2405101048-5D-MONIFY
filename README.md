# MONIFY — versi Frontend (HTML + CSS + JS)

Versi statis dari aplikasi PHP MONIFY. Tidak butuh PHP, XAMPP, atau MySQL.
Data dummy dibuat otomatis dan disimpan di `localStorage` browser.

## Cara menjalankan
Buka `index.html` di browser (klik dua kali). Akun demo sudah terisi di halaman login:
`demo@monify.test` / `demo12345`.
Perlu internet untuk memuat Chart.js, ikon Lucide, dan font Google.

## Pembagian tugas (penting untuk dipahami)
| Bagian | Tugasnya |
|---|---|
| **HTML** (`*.html`) | SEMUA tampilan: sidebar, topbar, kartu, tabel, form, modal. |
| **CSS** (`assets/css/`) | Gaya tampilan. |
| **JS** (`assets/js/`) | Hanya logika: ambil data dummy, isi teks ke elemen, tangani klik & form. |

JS tidak membuat tampilan. JS mencari elemen lewat `id` lalu mengisinya:

```html
<!-- di HTML -->
<strong class="stat-value" id="statBalance">Rp0</strong>
```
```js
// di JS
$('#statBalance').textContent = rp(income - expense);
```

**Baris yang berulang** (daftar transaksi, kartu anggaran, dll) ditulis sekali sebagai `<template>` di HTML.
JS menyalinnya untuk tiap data lalu mengisi elemen ber-class `js-...`:

```html
<template id="tplTxItem">
  <li><strong class="js-title"></strong> <span class="js-amount"></span></li>
</template>
```
```js
const li = tpl('tplTxItem');                         // salin template
setText(li, { title: 'Kopi', amount: 'Rp20.000' });  // isi .js-title dan .js-amount
list.appendChild(li);                                // tempel ke halaman
```
Class berawalan `js-` hanya penanda untuk JS (tidak ada gayanya di CSS).

## Struktur
```
monify-frontend/
├── index.html, login.html, register.html, dashboard.html, transactions.html,
│   budgets.html, categories.html, reports.html, settings.html
└── assets/
    ├── css/
    │   ├── main.css            ← satu-satunya CSS yang dipanggil HTML (@import semua di bawah)
    │   ├── base/               variables (warna & tema), reset, utilities
    │   ├── layout/             layout (sidebar/topbar), grid
    │   ├── components/         buttons, forms, cards, stats, charts, modal, table, dll
    │   ├── pages/              auth, settings
    │   └── responsive.css      tampilan HP/tablet
    └── js/
        ├── core/               helpers (format rupiah/tanggal), data (data dummy + localStorage), queries (hitungan)
        ├── ui/                 layout (pesan flash, modal, isi sidebar), charts (grafik Chart.js)
        └── pages/              satu file per halaman: dashboard, transactions, budgets, categories, reports, settings, auth
```

## Urutan `<script>` di setiap HTML (jangan dibalik)
```html
<script src="assets/js/core/helpers.js"></script>
<script src="assets/js/core/data.js"></script>
<script src="assets/js/core/queries.js"></script>
<script src="assets/js/ui/layout.js"></script>
<script src="assets/js/pages/dashboard.js"></script>   <!-- file halaman terakhir -->
```
Halaman dengan grafik (dashboard, reports) juga memuat Chart.js dan `ui/charts.js`.
Semua file berbagi satu namespace `window.Monify` (script biasa, bukan ES module, supaya bisa dibuka lewat `file://`).

## Catatan
- Tambah/edit/hapus transaksi, anggaran, dan kategori berfungsi dan tersimpan di browser.
- Reset ke data awal: Settings → Appearance → "Reset data demo".
- Sidebar & topbar disalin di tiap file HTML (belum ada include seperti `header.php`), jadi kalau mengubah menu, ubah di tiap file.
- Semua akun berbagi satu set data dummy (tidak ada backend).

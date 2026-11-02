// Transaksi: filter, paginasi, tambah/edit/hapus. Markup (tabel, form, modal) ada di transactions.html
(function (M) {
  const { $, $$, S, save, cat, tgl, iso, rp, NOW, fd, nextId, tpl, setText, initLayout, icons, flash, openModal, closeModal, fillSelect, fillCats } = M;
  if (!initLayout()) return;

  const F = { q: '', type: '', cat: '', from: '', to: '', sort: 'desc', page: 1 };   // keadaan filter
  const txForm = $('#txForm');

  // Isi dropdown kategori di filter (sekali saja)
  fillSelect($('#filterCat'), [['', 'Semua kategori'], ...[...S.cats].sort((a, b) => a.type < b.type ? 1 : a.type > b.type ? -1 : a.name.localeCompare(b.name))
    .map(c => [c.id, c.name + ' (' + (c.type === 'income' ? 'In' : 'Out') + ')'])]);

  function render() {
    const q = F.q.toLowerCase();
    const rows = S.tx.filter(t => (!q || (t.title + ' ' + t.description).toLowerCase().includes(q)) && (!F.type || t.type === F.type)
        && (!F.cat || t.category_id == F.cat) && (!F.from || t.date >= F.from) && (!F.to || t.date <= F.to))
      .sort((a, b) => (a.date === b.date ? a.id - b.id : a.date < b.date ? -1 : 1) * (F.sort === 'asc' ? 1 : -1));
    const pages = Math.max(1, Math.ceil(rows.length / 10)); F.page = Math.min(F.page, pages);
    const start = (F.page - 1) * 10;

    $('#txCount').textContent = rows.length + ' transaksi ditemukan';
    $('#txReset').hidden = !(F.q || F.type || F.cat || F.from || F.to);
    $('#txEmpty').hidden = rows.length > 0;
    const body = $('#txBody'); body.innerHTML = '';
    rows.slice(start, start + 10).forEach((t, i) => {
      const tr = tpl('tplTxRow'), isInc = t.type === 'income';
      setText(tr, { no: start + i + 1, title: t.title, desc: t.description.slice(0, 60), cat: cat(t.category_id).name, date: tgl(t.date),
        type: isInc ? 'Income' : 'Expense', amount: (isInc ? '+' : '−') + rp(t.amount) });
      tr.querySelector('.js-desc').hidden = !t.description;
      tr.querySelector('.js-type').classList.add('b-' + t.type);
      tr.querySelector('.js-amount').classList.add(isInc ? 'amt-inc' : 'amt-exp');
      tr.querySelector('.js-edit').addEventListener('click', () => openTx(t));
      tr.querySelector('.js-del').addEventListener('click', () => { $('#delId').value = t.id; $('#delTitle').textContent = t.title; openModal('delModal'); });
      body.appendChild(tr);
    });
    $('#pager').hidden = pages <= 1;
    $('#pageInfo').textContent = 'Halaman ' + F.page + ' dari ' + pages;
    $('#prevBtn').classList.toggle('disabled', F.page <= 1);
    $('#nextBtn').classList.toggle('disabled', F.page >= pages);
    icons();
  }

  // Buka modal tambah (t kosong) atau edit (t berisi transaksi)
  function openTx(t) {
    txForm.reset();
    const type = t ? t.type : 'expense';
    $('#txId').value = t ? t.id : '';
    $('#txModalTitle').textContent = t ? 'Edit Transaction' : 'Add Transaction';
    txForm.querySelector('input[name=type][value=' + type + ']').checked = true;
    fillCats($('#txCategory'), type, t && t.category_id);
    $('#txTitle').value = t ? t.title : ''; $('#txAmount').value = t ? t.amount : '';
    $('#txDate').value = t ? t.date : iso(NOW); $('#txDesc').value = t ? t.description : '';
    openModal('txModal');
  }

  $('#addTxBtn').addEventListener('click', () => openTx());
  txForm.querySelectorAll('input[name=type]').forEach(r => r.addEventListener('change', () => fillCats($('#txCategory'), r.value)));

  txForm.addEventListener('submit', e => {
    e.preventDefault();
    const d = fd(txForm), c = S.cats.find(x => x.id == d.category_id), amount = Number(d.amount), title = d.title.trim(), er = [];
    if (!title) er.push('Nama transaksi wajib diisi.');
    if (!(amount > 0)) er.push('Nominal harus berupa angka lebih dari 0.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) er.push('Tanggal tidak valid.');
    if (!c) er.push('Kategori tidak ditemukan.'); else if (c.type !== d.type) er.push('Kategori tidak sesuai dengan jenis transaksi.');
    closeModal($('#txModal'));
    if (er.length) return flash('error', er.join(' '));
    const data = { type: d.type, title, amount, date: d.date, category_id: c.id, description: d.description.trim() };
    if (d.id) Object.assign(S.tx.find(t => t.id == d.id), data); else S.tx.push({ id: nextId('tx'), ...data });
    save(); render(); flash('success', d.id ? 'Transaksi berhasil diperbarui.' : 'Transaksi berhasil ditambahkan.');
  });

  $('#delForm').addEventListener('submit', e => {
    e.preventDefault();
    S.tx = S.tx.filter(t => t.id != $('#delId').value); save(); closeModal($('#delModal')); render(); flash('success', 'Transaksi dihapus.');
  });

  $('#txFilter').addEventListener('submit', e => {
    e.preventDefault(); const d = fd(e.target);
    Object.assign(F, { q: d.q.trim(), type: d.type, cat: d.cat, from: d.from, to: d.to, sort: d.sort, page: 1 }); render();
  });
  $('#txReset').addEventListener('click', () => { $('#txFilter').reset(); Object.assign(F, { q: '', type: '', cat: '', from: '', to: '', sort: 'desc', page: 1 }); render(); });
  $('#prevBtn').addEventListener('click', () => { F.page--; render(); });
  $('#nextBtn').addEventListener('click', () => { F.page++; render(); });

  render();
  if (new URLSearchParams(location.search).get('add') === '1') openTx();
})(window.Monify);

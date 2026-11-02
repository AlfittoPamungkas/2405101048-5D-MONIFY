// Anggaran bulanan. Markup ada di budgets.html
(function (M) {
  const { $, S, save, cat, rp, CM, CY, B, fd, nextId, sum, budgetRows, statusLbl, tpl, setText, initLayout, icons, flash, openModal, closeModal, fillSelect, fillYears } = M;
  if (!initLayout()) return;

  let month = CM, year = CY;                       // periode yang sedang ditampilkan
  const form = $('#budForm'), filter = $('#budFilter');
  fillYears(filter.elements.year, year); filter.elements.month.value = month;

  function render() {
    const rows = budgetRows(month, year);
    $('#totLimit').textContent = rp(sum(rows)); $('#totSpent').textContent = rp(sum(rows, 'spent'));
    $('#budEmpty').hidden = rows.length > 0; $('#budEmptyText').textContent = 'Belum ada anggaran untuk ' + B[month - 1] + ' ' + year + '.';
    $('#budPeriod').textContent = B[month - 1] + ' ' + year;
    const grid = $('#budGrid'); grid.innerHTML = '';
    rows.forEach(b => {
      const card = tpl('tplBudCard');
      setText(card, { name: b.name, status: statusLbl(b.status), spent: rp(b.spent), limit: '/ ' + rp(b.amount), pct: b.pct.toFixed(1) + '% terpakai', left: b.left >= 0 ? 'Sisa ' + rp(b.left) : 'Lebih ' + rp(-b.left) });
      card.querySelector('.js-status').classList.add('b-' + b.status);
      card.querySelector('.js-progress').classList.add('s-' + b.status);
      card.querySelector('.js-bar').style.width = Math.min(100, Math.round(b.pct)) + '%';
      const note = card.querySelector('.js-note');
      if (b.status !== 'normal') {
        note.hidden = false; note.classList.add('n-' + b.status);
        note.querySelector('.js-note-text').textContent = b.status === 'warning' ? 'Penggunaan sudah mencapai 80% — hati-hati.' : 'Anggaran terlampaui.';
        note.querySelector('i').setAttribute('data-lucide', b.status === 'warning' ? 'triangle-alert' : 'octagon-alert');
      }
      card.querySelector('.js-edit').addEventListener('click', () => openBud(b));
      card.querySelector('.js-del').addEventListener('click', () => {
        if (!confirm('Hapus anggaran ' + b.name + '?')) return;
        S.budgets = S.budgets.filter(x => x.id !== b.id); save(); render(); flash('success', 'Anggaran dihapus.');
      });
      grid.appendChild(card);
    });
    icons();
  }

  function openBud(b) {
    const used = S.budgets.filter(x => x.month === month && x.year === year).map(x => x.category_id);
    form.reset(); $('#budId').value = b ? b.id : ''; $('#budTitle').textContent = b ? 'Edit Anggaran' : 'Tambah Anggaran';
    fillSelect($('#budCategory'), S.cats.filter(c => c.type === 'expense').sort((a, c) => a.name.localeCompare(c.name)).map(c => {
      const taken = used.includes(c.id) && !(b && b.category_id === c.id);
      return [c.id, c.name + (taken ? ' (sudah ada)' : ''), taken];
    }), b ? b.category_id : null);
    if (!b) { const free = [...$('#budCategory').options].find(o => !o.disabled); if (free) $('#budCategory').value = free.value; }
    $('#budAmount').value = b ? b.amount : ''; openModal('budModal');
  }

  $('#addBudBtn').addEventListener('click', () => openBud());
  filter.addEventListener('submit', e => { e.preventDefault(); const d = fd(filter); month = +d.month; year = +d.year; render(); });
  form.addEventListener('submit', e => {
    e.preventDefault(); const d = fd(form), amount = Number(d.amount), id = $('#budId').value; closeModal($('#budModal'));
    if (!(amount > 0)) return flash('error', 'Limit anggaran harus lebih dari 0.');
    if (S.budgets.some(b => b.category_id == d.category_id && b.month === month && b.year === year && b.id != id)) return flash('error', 'Kategori ini sudah punya anggaran di periode tersebut.');
    if (id) Object.assign(S.budgets.find(b => b.id == id), { category_id: +d.category_id, amount });
    else S.budgets.push({ id: nextId('bud'), category_id: +d.category_id, month, year, amount });
    save(); render(); flash('success', id ? 'Anggaran diperbarui.' : 'Anggaran ditambahkan.');
  });
  render();
})(window.Monify);

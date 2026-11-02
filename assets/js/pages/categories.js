// Kategori. Markup ada di categories.html
(function (M) {
  const { $, S, save, cat, nextId, tpl, setText, initLayout, icons, flash, openModal, closeModal } = M;
  if (!initLayout()) return;
  const form = $('#catForm');

  function render() {
    ['income', 'expense'].forEach(type => {
      const list = $('#' + type + 'List'); list.innerHTML = '';
      const items = S.cats.filter(c => c.type === type).sort((a, b) => a.name.localeCompare(b.name));
      $('#' + type + 'Count').textContent = items.length + ' kategori';
      $('#' + type + 'Empty').hidden = items.length > 0;
      items.forEach(c => {
        const used = S.tx.filter(t => t.category_id === c.id).length, li = tpl('tplCatItem');
        setText(li, { name: c.name, info: (c.description ? c.description + ' · ' : '') + used + ' transaksi' });
        li.querySelector('.js-ico').classList.add(type);
        li.querySelector('.js-ico i').setAttribute('data-lucide', type === 'income' ? 'arrow-down-left' : 'arrow-up-right');
        li.querySelector('.js-edit').addEventListener('click', () => openCat(c));
        li.querySelector('.js-del').addEventListener('click', () => {
          if (used > 0) return flash('error', `Kategori dipakai oleh ${used} transaksi dan tidak dapat dihapus. Ubah dulu kategori transaksinya.`);
          if (!confirm('Hapus kategori ' + c.name + '?')) return;
          S.cats = S.cats.filter(x => x.id !== c.id); S.budgets = S.budgets.filter(b => b.category_id !== c.id); save(); render(); flash('success', 'Kategori dihapus.');
        });
        list.appendChild(li);
      });
    });
    icons();
  }

  function openCat(c) {
    form.reset(); $('#catId').value = c ? c.id : ''; $('#catTitle').textContent = c ? 'Edit Kategori' : 'Tambah Kategori';
    $('#catName').value = c ? c.name : ''; $('#catDesc').value = c ? c.description || '' : ''; if (c) $('#catType').value = c.type;
    $('#catTypeWrap').hidden = !!c;           // jenis kategori tidak bisa diubah saat edit
    openModal('catModal');
  }
  $('#addCatBtn').addEventListener('click', () => openCat());
  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = $('#catId').value, name = $('#catName').value.trim(), description = $('#catDesc').value.trim(), type = id ? cat(id).type : $('#catType').value;
    closeModal($('#catModal'));
    if (!name) return flash('error', 'Nama kategori wajib diisi (maks. 80 karakter).');
    if (S.cats.some(c => c.type === type && c.name.toLowerCase() === name.toLowerCase() && c.id != id)) return flash('error', 'Nama kategori sudah ada pada jenis yang sama.');
    if (id) Object.assign(cat(id), { name, description }); else S.cats.push({ id: nextId('cat'), name, type, description });
    save(); render(); flash('success', id ? 'Kategori diperbarui.' : 'Kategori ditambahkan.');
  });
  render();
})(window.Monify);

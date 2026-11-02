// Pengaturan: profil, password, tampilan. Ketiga bagian ada di settings.html, JS hanya menampilkan yang dipilih (?tab=...)
(function (M) {
  const { $, $$, S, save, user, fd, seed, initLayout, flash, goFlash } = M;
  if (!initLayout()) return;

  const asked = new URLSearchParams(location.search).get('tab');
  const tab = ['profile', 'password', 'appearance'].includes(asked) ? asked : 'appearance';
  ['profile', 'password', 'appearance'].forEach(t => { $('#tab-' + t).hidden = t !== tab; $('#tabLink-' + t).classList.toggle('on', t === tab); });
  const isProfile = tab === 'profile', title = isProfile ? 'Profile' : 'Settings';
  $('#pageTitle').textContent = title; $('#crumbTitle').textContent = title; document.title = title + ' — MONIFY';
  $('#navSettings').classList.toggle('active', !isProfile); $('#navProfile').classList.toggle('active', isProfile);

  // Isi form dengan data user
  const u = user();
  $('#profileForm').elements.name.value = u.name; $('#profileForm').elements.email.value = u.email;
  document.querySelector('input[name=theme][value=' + S.theme + ']').checked = true;

  $('#profileForm').addEventListener('submit', e => {
    e.preventDefault(); const d = fd(e.target), name = d.name.trim(), email = d.email.trim();
    if (name.length < 2 || name.length > 100) return flash('error', 'Nama harus 2–100 karakter.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return flash('error', 'Format email tidak valid.');
    if (S.users.some(x => x.email.toLowerCase() === email.toLowerCase() && x.id !== S.uid)) return flash('error', 'Email sudah dipakai akun lain.');
    Object.assign(u, { name, email }); goFlash('success', 'Profil disimpan.', 'settings.html?tab=profile');
  });
  $('#pwForm').addEventListener('submit', e => {
    e.preventDefault(); const d = fd(e.target);
    if (d.current !== u.password) return flash('error', 'Password saat ini salah.');
    if (d.new.length < 8) return flash('error', 'Password baru minimal 8 karakter.');
    if (d.new !== d.confirm) return flash('error', 'Konfirmasi password baru tidak cocok.');
    u.password = d.new; goFlash('success', 'Password berhasil diubah.', 'settings.html?tab=password');
  });
  // Pratinjau tema langsung saat dipilih, disimpan saat tombol Simpan ditekan
  $$('input[name=theme]').forEach(r => r.addEventListener('change', () => { document.documentElement.dataset.theme = r.value; }));
  $('#themeForm').addEventListener('submit', e => {
    e.preventDefault(); S.theme = fd(e.target).theme === 'dark' ? 'dark' : 'light'; goFlash('success', 'Tampilan disimpan.', 'settings.html?tab=appearance');
  });
  $('#resetDemoBtn').addEventListener('click', () => {
    if (!confirm('Kembalikan semua data ke data dummy awal?')) return;
    const uid = S.uid; Object.keys(S).forEach(k => delete S[k]); Object.assign(S, seed(), { uid }); save(); location.reload();
  });
})(window.Monify);

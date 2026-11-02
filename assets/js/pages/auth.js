// Dipakai login.html dan register.html (form-nya sudah ada di HTML).
(function (M) {
  const { $, S, save, user, fd, nextId, flash, goFlash, showStoredFlash } = M;
  if (S.uid && user()) return location.replace('dashboard.html');
  showStoredFlash();

  const login = $('#loginForm');
  if (login) login.addEventListener('submit', e => {
    e.preventDefault();
    const d = fd(login);
    const u = S.users.find(x => x.email.toLowerCase() === d.email.trim().toLowerCase() && x.password === d.password);
    if (!u) return flash('error', 'Email atau password salah.');
    S.uid = u.id; save(); location.href = 'dashboard.html';
  });

  const reg = $('#regForm');
  if (reg) reg.addEventListener('submit', e => {
    e.preventDefault();
    const d = fd(reg), er = [], name = d.name.trim(), email = d.email.trim();
    if (name.length < 2 || name.length > 100) er.push('Nama lengkap harus 2–100 karakter.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) er.push('Format email tidak valid.');
    if (d.password.length < 8) er.push('Password minimal 8 karakter.');
    if (d.password !== d.confirm) er.push('Konfirmasi password tidak cocok.');
    if (!er.length && S.users.some(u => u.email.toLowerCase() === email.toLowerCase())) er.push('Email sudah terdaftar.');
    if (er.length) return flash('error', er.join(' '));
    S.users.push({ id: nextId('user'), name, email, password: d.password });
    goFlash('success', 'Registrasi berhasil. Silakan masuk.', 'login.html');
  });
})(window.Monify);

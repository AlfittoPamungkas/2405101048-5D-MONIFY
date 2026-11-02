// index.html hanya mengarahkan ke login atau dashboard.
(function (M) { location.replace(M.S.uid && M.user() ? 'dashboard.html' : 'login.html'); })(window.Monify);

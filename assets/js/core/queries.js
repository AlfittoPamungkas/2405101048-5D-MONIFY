// Perhitungan turunan: anggaran, pengeluaran per kategori, arus kas.
(function (M) {
  const { B, $, $$, esc, rp, iso, ago, tgl, ini, NOW, CM, CY, mrange, fd, S, seed, save, user, cat, nextId } = M;
  const statusOf = p => p >= 100 ? 'exceeded' : p >= 80 ? 'warning' : 'normal';
  const statusLbl = s => ({ normal: 'Normal', warning: 'Mendekati batas', exceeded: 'Terlampaui' })[s];
  function budgetRows(m, y) {
    const [f, t] = mrange(m, y);
    return S.budgets.filter(b => b.month == m && b.year == y).map(b => {
      const spent = S.tx.filter(x => x.type === 'expense' && x.category_id === b.category_id && x.date >= f && x.date <= t).reduce((a, x) => a + x.amount, 0);
      const pct = b.amount > 0 ? spent / b.amount * 100 : 0;
      return { ...b, name: cat(b.category_id).name, spent, left: b.amount - spent, pct, status: statusOf(pct) };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }
  const sum = (arr, k = 'amount') => arr.reduce((a, x) => a + x[k], 0);
  function byCat(m, y) {
    const [f, t] = mrange(m, y), mp = {};
    S.tx.filter(x => x.type === 'expense' && x.date >= f && x.date <= t).forEach(x => mp[x.category_id] = (mp[x.category_id] || 0) + x.amount);
    const total = Object.values(mp).reduce((a, b) => a + b, 0);
    return Object.entries(mp).map(([id, v]) => ({ name: cat(id).name, total: v, pct: +(v / total * 100).toFixed(1) })).sort((a, b) => b.total - a.total);
  }
  function flow(range) {
    const n = NOW; let f, t;
    if (range === '7d') { f = ago(6); t = ago(0); }
    else if (range === 'last') { f = iso(new Date(CY, CM - 2, 1)); t = iso(new Date(CY, CM - 1, 0)); }
    else[f, t] = mrange(CM, CY);
    const labels = [], income = [], expense = [];
    for (let d = new Date(f + 'T00:00'); iso(d) <= t; d.setDate(d.getDate() + 1)) {
      const k = iso(d), s = ty => sum(S.tx.filter(x => x.date === k && x.type === ty));
      labels.push(d.getDate() + ' ' + B[d.getMonth()].slice(0, 3)); income.push(s('income')); expense.push(s('expense'));
    }
    return { labels, income, expense };
  }
  Object.assign(M, { statusOf, statusLbl, budgetRows, sum, byCat, flow });
})(window.Monify = window.Monify || {});

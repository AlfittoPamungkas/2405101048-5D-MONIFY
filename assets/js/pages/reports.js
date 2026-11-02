// Laporan bulanan. Markup ada di reports.html
(function (M) {
  const { $, S, rp, CM, CY, B, fd, sum, mrange, byCat, initLayout, icons, charts, killCharts, colors, series, lineOpts, donut } = M;
  if (!initLayout()) return;

  let month = CM, year = CY;
  const filter = $('#repFilter');
  M.fillYears(filter.elements.year, year); filter.elements.month.value = month;

  function render() {
    killCharts();
    const [from, to] = mrange(month, year), tx = S.tx.filter(x => x.date >= from && x.date <= to);
    const income = sum(tx.filter(x => x.type === 'income')), expense = sum(tx.filter(x => x.type === 'expense')), net = income - expense;
    const items = byCat(month, year), top = items[0];

    $('#repIncome').textContent = rp(income); $('#repExpense').textContent = rp(expense);
    $('#repNet').textContent = (net < 0 ? '−' : '') + rp(Math.abs(net)); $('#repCount').textContent = tx.length;
    $('#repTop').textContent = top ? top.name : '—'; $('#repTopVal').textContent = top ? rp(top.total) : '';
    $('#repSummary').textContent = !tx.length ? 'Belum ada transaksi pada periode ini.'
      : `Pada ${B[month - 1]} ${year} kamu memiliki ${tx.length} transaksi. Pemasukan ${rp(income)} dan pengeluaran ${rp(expense)}, sehingga saldo bersih ${net < 0 ? 'minus ' : ''}${rp(Math.abs(net))}.`
        + (top ? ' Pengeluaran terbesar ada di kategori ' + top.name + ' (' + rp(top.total) + ').' : '');
    $('#trendTitle').textContent = 'Monthly Financial Trend ' + year;

    const C = colors(), opt = lineOpts();
    charts.push(new Chart($('#repBar'), { type: 'bar', data: { labels: ['Bulan ini'], datasets: [
      { label: 'Income', data: [income], backgroundColor: C.inc, borderRadius: 6, maxBarThickness: 70 },
      { label: 'Expense', data: [expense], backgroundColor: C.exp, borderRadius: 6, maxBarThickness: 70 }] }, options: { ...opt, interaction: {} } }));
    donut('repDonut', items);
    const perMonth = type => Array.from({ length: 12 }, (_, i) => sum(S.tx.filter(x => x.type === type && x.date.startsWith(year + '-' + String(i + 1).padStart(2, '0')))));
    charts.push(new Chart($('#repTrend'), { type: 'line', data: { labels: B.map(n => n.slice(0, 3)), datasets: series({ income: perMonth('income'), expense: perMonth('expense') }) }, options: opt }));
    icons();
  }
  filter.addEventListener('submit', e => { e.preventDefault(); const d = fd(filter); month = +d.month; year = +d.year; render(); });
  render();
})(window.Monify);

// Dashboard: isi angka, daftar, dan grafik ke elemen yang sudah ada di dashboard.html
(function (M) {
  const { $, $$, S, user, cat, tgl, iso, rp, NOW, CM, CY, B, sum, budgetRows, statusOf, statusLbl, byCat, flow,
          tpl, setText, initLayout, icons, charts, series, lineOpts, donut } = M;
  if (!initLayout()) return;

  // Sapaan
  const h = NOW.getHours();
  const greet = h < 11 ? 'Good Morning' : h < 15 ? 'Good Afternoon' : h < 19 ? 'Good Evening' : 'Good Night';
  $('#greeting').textContent = greet + ', ' + user().name.split(' ')[0];
  $('#subtitle').textContent = "Here's your financial overview. · " + tgl(iso(NOW));
  $('#donutMonth').textContent = B[CM - 1] + ' ' + CY;

  // Kartu statistik
  const income = sum(S.tx.filter(t => t.type === 'income')), expense = sum(S.tx.filter(t => t.type === 'expense'));
  $('#statBalance').textContent = rp(income - expense);
  $('#statIncome').textContent = rp(income);
  $('#statExpense').textContent = rp(expense);
  const budgets = budgetRows(CM, CY), budgetTotal = sum(budgets), pct = budgetTotal ? sum(budgets, 'spent') / budgetTotal * 100 : 0;
  $('#statBudget').textContent = rp(budgetTotal);
  if (budgetTotal > 0) {
    $('#budgetProgress').hidden = false;
    $('#budgetProgress').classList.add('s-' + statusOf(pct));
    $('#budgetBar').style.width = Math.min(100, Math.round(pct)) + '%';
    $('#budgetNote').textContent = Math.round(pct) + '% terpakai bulan ini';
  }

  // Ringkasan anggaran (template #tplBudgetRow)
  const list = $('#budgetList');
  $('#budgetEmpty').hidden = budgets.length > 0;
  budgets.forEach(b => {
    const row = tpl('tplBudgetRow');
    setText(row, { name: b.name, status: statusLbl(b.status), amount: rp(b.spent) + ' / ' + rp(b.amount),
      left: Math.round(b.pct) + '% · ' + (b.left >= 0 ? 'Sisa ' + rp(b.left) : 'Lebih ' + rp(-b.left)) });
    row.querySelector('.js-status').classList.add('b-' + b.status);
    row.querySelector('.js-progress').classList.add('s-' + b.status);
    row.querySelector('.js-bar').style.width = Math.min(100, Math.round(b.pct)) + '%';
    list.appendChild(row);
  });

  // 5 transaksi terbaru (template #tplTxItem)
  const recent = [...S.tx].sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id).slice(0, 5);
  recent.forEach(t => {
    const li = tpl('tplTxItem'), isInc = t.type === 'income';
    setText(li, { title: t.title, info: cat(t.category_id).name + ' · ' + tgl(t.date), amount: (isInc ? '+' : '−') + rp(t.amount), type: isInc ? 'Income' : 'Expense' });
    li.querySelector('.js-ico').classList.add(t.type);
    li.querySelector('.js-ico i').setAttribute('data-lucide', isInc ? 'arrow-down-left' : 'arrow-up-right');
    li.querySelector('.js-amt').classList.add(isInc ? 'amt-inc' : 'amt-exp');
    $('#recentList').appendChild(li);
  });

  // Grafik
  let flowChart;
  const loadFlow = range => {
    const d = flow(range); if (flowChart) flowChart.destroy();
    flowChart = new Chart($('#flowChart'), { type: range === '7d' ? 'bar' : 'line', data: { labels: d.labels, datasets: series(d) }, options: lineOpts() });
    charts.push(flowChart);
  };
  $$('#flowRange button').forEach(btn => btn.addEventListener('click', () => {
    $$('#flowRange button').forEach(x => x.classList.remove('on')); btn.classList.add('on'); loadFlow(btn.dataset.range);
  }));
  loadFlow('month');
  donut('donutChart', byCat(CM, CY));
  icons();
})(window.Monify);

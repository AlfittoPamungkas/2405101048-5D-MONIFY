// Helper Chart.js: warna tema, garis/bar, donut.
(function (M) {
  const { $, rp } = M;
  const charts = [];
  const killCharts = () => { charts.forEach(c => c.destroy()); charts.length = 0; };

  const dark = () => document.documentElement.dataset.theme === 'dark';
  const colors = () => ({ inc: dark() ? '#6cc197' : '#3f8f66', exp: dark() ? '#e07f80' : '#c25455', grid: dark() ? '#2a2a2a' : '#EFEFEF', tick: dark() ? '#A3A3A3' : '#737373', surface: dark() ? '#1A1A1A' : '#FFFFFF',
    palette: dark() ? ['#F5F5F5','#D4D4D4','#A3A3A3','#7a7a7a','#555555','#3f3f3f','#2f2f2f'] : ['#171717','#404040','#737373','#A3A3A3','#C4C4C4','#DADADA','#EAEAEA'] });
  const short = n => n >= 1e6 ? (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + ' jt' : n >= 1e3 ? Math.round(n / 1e3) + ' rb' : n;
  function series(d) { const C = colors(); const o = { borderRadius: 4, tension: .35, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2 };
    return [{ label: 'Income', data: d.income, borderColor: C.inc, backgroundColor: C.inc, ...o }, { label: 'Expense', data: d.expense, borderColor: C.exp, backgroundColor: C.exp, ...o }]; }
  function lineOpts() { const C = colors(); Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif"; Chart.defaults.color = C.tick;
    return { maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: 10 } }, y: { beginAtZero: true, grid: { color: C.grid }, border: { display: false }, ticks: { callback: short } } },
      plugins: { legend: { align: 'end', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { callbacks: { label: c => ' ' + c.dataset.label + ': ' + rp(c.parsed.y) } } } }; }
  function donut(id, items) {
    const el = $('#' + id), lg = $('#donutLegend'), C = colors();
    // Pesan kosong & item legenda diambil dari <template> / elemen di HTML (#donutEmpty, #tplLegend)
    const empty = document.getElementById('donutEmpty'); if (empty) empty.hidden = !!items.length;
    lg.innerHTML = '';
    if (!items.length) { el.style.display = 'none'; return; }
    el.style.display = '';
    items.forEach((i, k) => { const li = M.tpl('tplLegend'); li.querySelector('.js-sw').style.background = C.palette[k % 7];
      M.setText(li, { name: i.name, total: rp(i.total), pct: i.pct + '%' }); lg.appendChild(li); });
    charts.push(new Chart(el, { type: 'doughnut', data: { labels: items.map(i => i.name), datasets: [{ data: items.map(i => i.total), backgroundColor: items.map((_, i) => C.palette[i % 7]), borderColor: C.surface, borderWidth: 2 }] },
      options: { maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ' + c.label + ': ' + rp(c.parsed) } } } } }));
  }
  Object.assign(M, { charts, killCharts, dark, colors, short, series, lineOpts, donut });
})(window.Monify = window.Monify || {});

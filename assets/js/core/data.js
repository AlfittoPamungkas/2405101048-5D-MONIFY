// Data dummy + penyimpanan (localStorage). Pengganti MySQL.
(function (M) {
  const { B, $, $$, esc, rp, iso, ago, tgl, ini, NOW, CM, CY, mrange, fd } = M;
  const KEY = 'monify_frontend_v1';
  function seed() {
    const inc = ['Salary', 'Allowance', 'Freelance', 'Scholarship', 'Others'];
    const exp = ['Food & Beverage', 'Transportation', 'Education', 'Entertainment', 'Shopping', 'Rent', 'Utilities', 'Health', 'Others'];
    let id = 0;
    const cats = [...inc.map(n => ({ id: ++id, name: n, type: 'income', description: '' })), ...exp.map(n => ({ id: ++id, name: n, type: 'expense', description: '' }))];
    const cid = (t, n) => cats.find(c => c.type === t && c.name === n).id;
    const tx = []; let tid = 0;
    const add = (type, c, title, amount, date, description = '') => tx.push({ id: ++tid, type, category_id: cid(type, c), title, amount, date, description });
    // Tanggal dummy selalu jatuh di BULAN INI (walau hari ini tanggal 1), supaya dashboard tidak kosong.
    const dom = NOW.getDate(), squeeze = Math.min(1, (dom - 1) / 17);
    const dayOf = n => iso(new Date(CY, CM - 1, Math.max(1, dom - Math.round((n - 1) * squeeze))));
    [['Food & Beverage', 'Makan siang warteg', 18000, 1], ['Food & Beverage', 'Kopi & roti', 32000, 3], ['Food & Beverage', 'Makan malam ayam geprek', 25000, 5],
    ['Food & Beverage', 'Belanja bahan makanan', 120000, 9], ['Food & Beverage', 'Bubur ayam', 14000, 12], ['Food & Beverage', 'Makan bareng teman', 65000, 16],
    ['Transportation', 'Bensin motor', 40000, 2], ['Transportation', 'Ojek online', 22000, 7], ['Transportation', 'Bensin motor', 40000, 14],
    ['Education', 'Fotokopi modul', 15000, 4], ['Education', 'Beli buku referensi', 95000, 10], ['Entertainment', 'Langganan streaming', 54000, 6],
    ['Entertainment', 'Nonton bioskop', 50000, 15], ['Shopping', 'Kaos', 110000, 11], ['Utilities', 'Token listrik kos', 75000, 8],
    ['Utilities', 'Paket data', 65000, 13], ['Rent', 'Bayar kos bulanan', 800000, 1], ['Health', 'Obat flu', 28000, 17]
    ].forEach(([c, t, a, d]) => add('expense', c, t, a, dayOf(d)));
    add('income', 'Allowance', 'Kiriman orang tua', 2000000, iso(new Date(CY, CM - 1, 1)), 'Uang saku bulanan');
    add('income', 'Freelance', 'Proyek desain logo', 350000, dayOf(6));
    add('income', 'Scholarship', 'Beasiswa prestasi', 500000, dayOf(10));
    for (let k = 1; k <= 6; k++) { // riwayat bulan-bulan sebelumnya untuk grafik tren
      const d = n => iso(new Date(CY, CM - 1 - k, n));
      add('income', 'Allowance', 'Kiriman orang tua', 2000000, d(1));
      if (k % 2) add('income', 'Freelance', 'Proyek freelance', 300000 + k * 40000, d(12));
      add('expense', 'Rent', 'Bayar kos bulanan', 800000, d(2));
      add('expense', 'Food & Beverage', 'Makan & jajan', 520000 + k * 25000, d(10));
      add('expense', 'Transportation', 'Bensin & ojek', 140000 + k * 8000, d(15));
      add('expense', 'Entertainment', 'Hiburan', 80000 + k * 12000, d(20));
      add('expense', 'Utilities', 'Listrik & data', 140000, d(22));
    }
    const budgets = []; let bid = 0;
    [0, 1].forEach(k => {
      const dt = new Date(CY, CM - 1 - k, 1);
      [['Food & Beverage', 350000], ['Transportation', 100000], ['Education', 120000], ['Entertainment', 100000], ['Shopping', 100000], ['Utilities', 150000]]
        .forEach(([c, a]) => budgets.push({ id: ++bid, category_id: cid('expense', c), month: dt.getMonth() + 1, year: dt.getFullYear(), amount: a }));
    });
    return {
      uid: null, flash: null, theme: 'light', nid: { cat: id, tx: tid, bud: bid, user: 1 },
      users: [{ id: 1, name: 'Demo Mahasiswa', email: 'demo@monify.test', password: 'demo12345' }], cats, tx, budgets
    };
  }
  let S; try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
  if (!S) S = seed();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  const user = () => S.users.find(u => u.id === S.uid);
  const cat = id => S.cats.find(c => c.id == id) || { name: '?' };
  document.documentElement.dataset.theme = S.theme;
  const nextId = k => ++S.nid[k];
  Object.assign(M, { S, seed, save, user, cat, nextId });
})(window.Monify = window.Monify || {});

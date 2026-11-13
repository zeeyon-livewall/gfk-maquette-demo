// Écran Commandes : filtres par statut et fiche détaillée, même logique que la maquette du canevas.
(function () {
  var badges = { todo: 'badge b-orange', plan: 'badge b-blue', run: 'badge b-amber', done: 'badge b-green', bill: 'badge b-gray' };
  var labels = { todo: 'À planifier', plan: 'Planifiée', run: 'En cours', done: 'Livrée', bill: 'À facturer' };
  var ranks = { todo: 1, plan: 2, run: 5, done: 6, bill: 7 };
  var orders = [
    { id: 'TR-26-1204', ref: 'PO-55120', client: 'Distribution Boréal', from: 'Québec', to: 'Sherbrooke', km: 240, dur: '2 h 45', loadDay: 'ven. 13 nov.', loadTime: '06 h 30', deliv: 'ven. 13 nov., 11 h 00', truck: '', driver: '', cat: 'todo', price: '1 380 $', cost: '910 $', margin: '34 %', type: 'Sec', cargo: '22 palettes · 11,4 t', equip: 'Fourgon 53 pi', flag: 'Urgent · fenêtre de livraison stricte', flagCls: 'badge b-red', customs: false, created: '11 nov., 09 h 15 · L. Fortin' },
    { id: 'TR-26-1201', ref: 'PO-77402', client: 'Emballages Carrière', from: 'Montréal', to: 'Toronto', km: 540, dur: '6 h 10', loadDay: 'ven. 13 nov.', loadTime: '07 h 00', deliv: 'ven. 13 nov., 15 h 00', truck: '', driver: '', cat: 'todo', price: '1 650 $', cost: '1 180 $', margin: '28 %', type: 'Sec', cargo: '18 palettes · 9,8 t', equip: 'Fourgon 53 pi', flag: '', flagCls: '', customs: false, created: '10 nov., 15 h 40 · L. Fortin' },
    { id: 'TR-26-1202', ref: 'LEM-3391', client: 'Aliments Lemieux', from: 'Laval', to: 'Québec', km: 255, dur: '2 h 50', loadDay: 'sam. 14 nov.', loadTime: '05 h 00', deliv: 'sam. 14 nov., 09 h 30', truck: '', driver: '', cat: 'todo', price: '1 120 $', cost: '760 $', margin: '32 %', type: 'Réfrigéré −18 °C', cargo: '26 palettes · 14,2 t', equip: 'Réfrigéré 53 pi', flag: 'Chaîne du froid · relevé de température requis', flagCls: 'badge b-blue', customs: false, created: '11 nov., 11 h 02 · portail client' },
    { id: 'TR-26-1198', ref: 'PL-20931', client: 'Papiers Laurentides', from: 'Québec', to: 'Trois-Rivières', km: 130, dur: '1 h 30', loadDay: 'ven. 13 nov.', loadTime: '08 h 00', deliv: 'ven. 13 nov., 10 h 30', truck: 'T-108', driver: 'Julie Gagnon', ini: 'JG', cat: 'plan', price: '640 $', cost: '410 $', margin: '36 %', type: 'Sec', cargo: '14 palettes · 8,2 t', equip: 'Fourgon 53 pi', flag: '', flagCls: '', customs: false, created: '9 nov., 10 h 20 · L. Fortin', planned: '10 nov., 08 h 05 · T-108' },
    { id: 'TR-26-1199', ref: 'QNE-1180', client: 'Quincaillerie Nord-Est', from: 'Ottawa', to: 'Montréal', km: 200, dur: '2 h 15', loadDay: 'ven. 13 nov.', loadTime: '09 h 00', deliv: 'ven. 13 nov., 13 h 00', truck: 'T-131', driver: 'Sébastien Roy', ini: 'SR', cat: 'plan', price: '890 $', cost: '590 $', margin: '34 %', type: 'Sec', cargo: '20 palettes · 10,1 t', equip: 'Fourgon 48 pi', flag: '', flagCls: '', customs: false, created: '9 nov., 14 h 48 · L. Fortin', planned: '10 nov., 08 h 10 · T-131' },
    { id: 'TR-26-1184', ref: 'LEM-3376', client: 'Aliments Lemieux', from: 'Laval', to: 'Toronto', km: 540, dur: '6 h 10', loadDay: 'jeu. 12 nov.', loadTime: '05 h 00', deliv: 'jeu. 12 nov., 14 h 20', truck: 'T-112', driver: 'Martin Tremblay', ini: 'MT', cat: 'run', price: '1 720 $', cost: '1 190 $', margin: '31 %', type: 'Réfrigéré 2 °C', cargo: '24 palettes · 13,1 t', equip: 'Réfrigéré 53 pi', flag: '', flagCls: '', customs: false, created: '6 nov., 16 h 30 · portail client', planned: '9 nov., 09 h 00 · T-112', pretrip: '12 nov., 04 h 38 · conforme', loaded: '12 nov., 05 h 35 · Laval, quai 2', enroute: '12 nov., 05 h 50 · ETA 14 h 20' },
    { id: 'TR-26-1187', ref: 'PL-20912', client: 'Papiers Laurentides', from: 'Trois-Rivières', to: 'Boston (MA)', km: 560, dur: '7 h 30', loadDay: 'jeu. 12 nov.', loadTime: '07 h 00', deliv: 'jeu. 12 nov., 18 h 45', truck: 'T-121', driver: 'Karim Benali', ini: 'KB', cat: 'run', price: '2 380 $', cost: '1 610 $', margin: '32 %', type: 'Sec · export', cargo: '20 palettes · 17,3 t', equip: 'Fourgon 53 pi', flag: 'Transfrontalier · PAPS transmis · heures de service à 94 %', flagCls: 'badge b-amber', customs: true, created: '10 nov., 14 h 05 · L. Fortin', planned: '10 nov., 16 h 20 · T-121', pretrip: '12 nov., 06 h 12 · conforme', loaded: '12 nov., 07 h 40 · Trois-Rivières, quai 4', enroute: '12 nov., 08 h 02 · douane Stanstead prévue 13 h 30' },
    { id: 'TR-26-1195', ref: 'MB-4471', client: 'Métallurgie Beauce', from: 'Saint-Georges', to: 'Mississauga', km: 790, dur: '9 h 00', loadDay: 'jeu. 12 nov.', loadTime: '06 h 00', deliv: 'jeu. 12 nov., 19 h 10', truck: 'T-126', driver: 'Patrick Lavoie', ini: 'PL', cat: 'run', price: '2 140 $', cost: '1 520 $', margin: '29 %', type: 'Fardier', cargo: 'Poutrelles · 16,8 t', equip: 'Fardier 48 pi · sangles', flag: '', flagCls: '', customs: false, created: '5 nov., 11 h 10 · L. Fortin', planned: '9 nov., 09 h 05 · T-126', pretrip: '12 nov., 05 h 20 · conforme', loaded: '12 nov., 06 h 50 · Saint-Georges', enroute: '12 nov., 07 h 05 · ETA 19 h 10' },
    { id: 'TR-26-1190', ref: 'PO-55098', client: 'Distribution Boréal', from: 'Montréal', to: 'Québec', km: 255, dur: '2 h 50', loadDay: 'jeu. 12 nov.', loadTime: '08 h 00', deliv: 'jeu. 12 nov., 11 h 42', truck: 'T-108', driver: 'Julie Gagnon', ini: 'JG', cat: 'done', price: '1 050 $', cost: '700 $', margin: '33 %', type: 'Sec', cargo: '22 palettes · 12,0 t', equip: 'Fourgon 53 pi', flag: '', flagCls: '', customs: false, created: '9 nov., 10 h 22 · L. Fortin', planned: '9 nov., 15 h 00 · T-108', pretrip: '12 nov., 07 h 15 · conforme', loaded: '12 nov., 08 h 30 · Montréal', enroute: '12 nov., 08 h 45', delivered: '12 nov., 11 h 42 · Québec, entrepôt 3' },
    { id: 'TR-26-1181', ref: 'GR-2208', client: 'Groupe Rivière', from: 'Drummondville', to: 'Montréal', km: 110, dur: '1 h 20', loadDay: 'mer. 11 nov.', loadTime: '13 h 00', deliv: 'mer. 11 nov., 15 h 10', truck: 'T-115', driver: 'Nadia Côté', ini: 'NC', cat: 'done', price: '520 $', cost: '350 $', margin: '33 %', type: 'Sec', cargo: '10 palettes · 4,6 t', equip: 'Fourgon 48 pi', flag: '', flagCls: '', customs: false, created: '9 nov., 08 h 40 · L. Fortin', planned: '9 nov., 09 h 30 · T-115', pretrip: '11 nov., 12 h 20 · conforme', loaded: '11 nov., 13 h 25', enroute: '11 nov., 13 h 40', delivered: '11 nov., 15 h 10 · Montréal' },
    { id: 'TR-26-1176', ref: 'BMR-910', client: 'Brasserie Mont-Royal', from: 'Montréal', to: 'Halifax (NS)', km: 1250, dur: '2 jours', loadDay: 'lun. 9 nov.', loadTime: '06 h 00', deliv: 'mar. 10 nov., 16 h 30', truck: 'T-126', driver: 'Patrick Lavoie', ini: 'PL', cat: 'bill', price: '3 450 $', cost: '2 480 $', margin: '28 %', type: 'Sec', cargo: '26 palettes · 19,5 t', equip: 'Fourgon 53 pi', flag: '', flagCls: '', customs: false, created: '3 nov., 09 h 00 · L. Fortin', planned: '4 nov., 10 h 15 · T-126', pretrip: '9 nov., 05 h 30 · conforme', loaded: '9 nov., 06 h 40', enroute: '9 nov., 06 h 55', delivered: '10 nov., 16 h 30 · Halifax', pod: '10 nov., 16 h 36 · signé M. Doucet' },
    { id: 'TR-26-1172', ref: 'FDC-512', client: 'Fromagerie des Cantons', from: 'Sherbrooke', to: 'Montréal', km: 155, dur: '1 h 45', loadDay: 'lun. 9 nov.', loadTime: '07 h 00', deliv: 'lun. 9 nov., 09 h 20', truck: 'T-115', driver: 'Nadia Côté', ini: 'NC', cat: 'bill', price: '610 $', cost: '400 $', margin: '34 %', type: 'Réfrigéré 4 °C', cargo: '12 palettes · 6,8 t', equip: 'Réfrigéré 48 pi', flag: '', flagCls: '', customs: false, created: '5 nov., 13 h 10 · portail client', planned: '6 nov., 08 h 00 · T-115', pretrip: '9 nov., 06 h 20 · conforme', loaded: '9 nov., 07 h 15', enroute: '9 nov., 07 h 30', delivered: '9 nov., 09 h 20 · Montréal', pod: '9 nov., 09 h 24 · signé A. Tran' }
  ];
  var tabDefs = [['all', 'Toutes'], ['todo', 'À planifier'], ['plan', 'Planifiées'], ['run', 'En cours'], ['done', 'Livrées'], ['bill', 'À facturer']];
  var state = { sel: 'TR-26-1187', tab: 'all' };
  var DOC_ICON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px;color:#5B6675"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function decorate(o) {
    var rank = ranks[o.cat];
    var base = [['Commande créée', o.created], ['Planifiée', o.planned], ['Ronde de sécurité', o.pretrip], ['Chargement', o.loaded], ['En route', o.enroute], ['Livraison', o.delivered], ['Preuve de livraison (POD)', o.pod], ['Facturée', o.invoiced]];
    var steps = base.map(function (s, i) {
      return { label: s[0], time: s[1] || (i === rank ? 'En attente' : '—'), cls: i < rank ? 'st done' : (i === rank ? 'st now' : 'st') };
    });
    var docs = [{ name: 'Connaissement (BOL)', state: rank >= 3 ? 'Signé' : 'Généré', cls: rank >= 3 ? 'badge b-green' : 'badge b-gray' }];
    if (o.customs) docs.push({ name: 'Déclaration douanière (PAPS / ACE)', state: 'Transmise', cls: 'badge b-green' });
    docs.push({ name: 'Preuve de livraison (POD)', state: rank >= 7 ? 'Signée' : 'En attente', cls: rank >= 7 ? 'badge b-green' : 'badge b-gray' });
    docs.push({ name: 'Facture client', state: rank >= 8 ? 'Émise' : 'Non émise', cls: rank >= 8 ? 'badge b-green' : 'badge b-gray' });
    var assigned = !!o.truck;
    var d = {};
    for (var k in o) d[k] = o[k];
    d.status = labels[o.cat];
    d.badge = badges[o.cat];
    d.who = assigned ? o.driver : 'Non assigné';
    d.truckLabel = assigned ? o.truck : 'À assigner';
    d.load = o.loadDay + ', ' + o.loadTime;
    d.hasFlag = !!o.flag;
    d.assigned = assigned;
    d.steps = steps;
    d.docs = docs;
    return d;
  }

  function rowHTML(o) {
    return '<tr class="row' + (o.id === state.sel ? ' sel' : '') + '" data-id="' + esc(o.id) + '">' +
      '<td><button type="button" class="lnk">' + esc(o.id) + '</button><div class="sub">' + esc(o.ref) + '</div></td>' +
      '<td style="font-weight:500">' + esc(o.client) + '</td>' +
      '<td>' + esc(o.from) + ' → ' + esc(o.to) + '<div class="sub">' + o.km + ' km · ' + esc(o.type) + '</div></td>' +
      '<td>' + esc(o.loadDay) + '<div class="sub">' + esc(o.loadTime) + '</div></td>' +
      '<td>' + esc(o.who) + '<div class="sub">' + esc(o.truckLabel) + '</div></td>' +
      '<td><span class="' + o.badge + '">' + esc(o.status) + '</span></td>' +
      '<td class="num" style="font-weight:600">' + esc(o.price) + '</td></tr>';
  }

  function detailHTML(c) {
    var h = '<div class="ch" style="margin-bottom:10px"><div><h2 style="font-size:17px">' + esc(c.id) + '</h2><span class="sub">' + esc(c.client) + ' · réf. ' + esc(c.ref) + '</span></div><span class="' + c.badge + '">' + esc(c.status) + '</span></div>';
    if (c.hasFlag) h += '<div style="margin-bottom:10px"><span class="' + c.flagCls + '" style="white-space:normal;line-height:1.35">' + esc(c.flag) + '</span></div>';
    h += '<div style="background:#F8FAFC;border:1px solid #E3E8EF;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;font-size:13px">' +
      '<div style="display:flex;gap:10px;align-items:flex-start"><span class="av" style="width:24px;height:24px;flex-basis:24px;font-size:10px;background:#1F2733;color:#fff">A</span><div><strong>' + esc(c.from) + '</strong><div class="sub">Chargement · ' + esc(c.load) + '</div></div></div>' +
      '<div style="display:flex;gap:10px;align-items:flex-start"><span class="av" style="width:24px;height:24px;flex-basis:24px;font-size:10px;background:#C2410C;color:#fff">B</span><div><strong>' + esc(c.to) + '</strong><div class="sub">Livraison · ' + esc(c.deliv) + '</div></div></div>' +
      '<div class="sub" style="padding-top:6px;border-top:1px solid #E3E8EF">' + c.km + ' km · ' + esc(c.dur) + ' de route estimées</div></div>';
    h += '<div class="sec">Marchandise</div><dl class="kv"><dt>Type</dt><dd>' + esc(c.type) + '</dd><dt>Chargement</dt><dd>' + esc(c.cargo) + '</dd><dt>Équipement</dt><dd>' + esc(c.equip) + '</dd></dl>';
    h += '<div class="sec">Affectation</div>';
    if (c.assigned) {
      h += '<div style="display:flex;align-items:center;gap:10px"><span class="av">' + esc(c.ini) + '</span><div><strong style="font-size:13px">' + esc(c.who) + '</strong><div class="sub">' + esc(c.truckLabel) + '</div></div><a class="btn sm" href="planning.html" style="margin-left:auto">Planning</a></div>';
    } else {
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span class="sub">Aucun camion assigné.</span><a class="btn sm p" href="planning.html">Assigner au planning</a></div>';
    }
    h += '<div class="sec">Rentabilité</div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">' +
      '<div style="background:#F8FAFC;border-radius:8px;padding:10px"><div class="sub">Prix</div><div style="font-weight:700;font-size:15px">' + esc(c.price) + '</div></div>' +
      '<div style="background:#F8FAFC;border-radius:8px;padding:10px"><div class="sub">Coûts estimés</div><div style="font-weight:700;font-size:15px">' + esc(c.cost) + '</div></div>' +
      '<div style="background:#F8FAFC;border-radius:8px;padding:10px"><div class="sub">Marge</div><div style="font-weight:700;font-size:15px;color:#166534">' + esc(c.margin) + '</div></div></div>';
    h += '<div class="sec">Suivi</div><div>' + c.steps.map(function (s) {
      return '<div class="' + s.cls + '"><span class="d"></span><div><div class="l">' + esc(s.label) + '</div><div class="t">' + esc(s.time) + '</div></div></div>';
    }).join('') + '</div>';
    h += '<div class="sec">Documents</div>' + c.docs.map(function (d) {
      return '<div class="doc">' + DOC_ICON + '<span style="flex:1">' + esc(d.name) + '</span><span class="' + d.cls + '">' + esc(d.state) + '</span></div>';
    }).join('');
    h += '<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap"><button class="btn sm" type="button">Modifier</button><button class="btn sm" type="button">Dupliquer</button><button class="btn sm" type="button" style="color:#B91C1C">Annuler la commande</button></div>';
    return h;
  }

  var tabsEl = document.getElementById('tabs');
  var rowsEl = document.getElementById('rows');
  var countEl = document.getElementById('count');
  var detailEl = document.getElementById('detail');
  if (!tabsEl || !rowsEl || !countEl || !detailEl) return;

  function render() {
    var all = orders.map(decorate);
    var list = all.filter(function (o) { return state.tab === 'all' || o.cat === state.tab; });
    var cur = null;
    for (var i = 0; i < all.length; i++) if (all[i].id === state.sel) cur = all[i];
    if (!cur) cur = all[0];
    tabsEl.innerHTML = tabDefs.map(function (t) {
      var n = t[0] === 'all' ? orders.length : orders.filter(function (o) { return o.cat === t[0]; }).length;
      return '<button type="button" class="tab' + (t[0] === state.tab ? ' on' : '') + '" role="tab" aria-selected="' + (t[0] === state.tab) + '" data-tab="' + t[0] + '">' + esc(t[1]) + '<span class="cnt">' + n + '</span></button>';
    }).join('');
    rowsEl.innerHTML = list.map(rowHTML).join('');
    countEl.textContent = list.length;
    detailEl.innerHTML = detailHTML(cur);
  }

  tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]');
    if (b) { state.tab = b.getAttribute('data-tab'); render(); }
  });
  rowsEl.addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-id]');
    if (tr) { state.sel = tr.getAttribute('data-id'); render(); }
  });
  render();
})();

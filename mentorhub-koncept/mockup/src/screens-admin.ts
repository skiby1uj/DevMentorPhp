/* ---------- A01 Wnioski ---------- */
const appStatus = (s: Application['status']) => ({ pending: badge('Oczekuje', 'warn'), approved: badge('Zatwierdzony', 'ok'), rejected: badge('Odrzucony', 'err'), changes: badge('Do poprawy', 'p') })[s];
reg('A01', 'Wnioski mentorów', ['admin'], () => {
  const t = S.tab.apps || 'pending'; const list = S.apps.filter(a => t === 'all' || a.status === t);
  const sel = list.find(a => a.id === S.selApp) || list[0];
  return `<h1>Wnioski mentorów</h1>${tabsHtml('apps', [['pending', 'Oczekujące'], ['changes', 'Do poprawy'], ['approved', 'Zatwierdzone'], ['rejected', 'Odrzucone'], ['all', 'Wszystkie']], 'pending')}` +
    withState({ empty: list.length === 0, emptyHtml: emptyBox('🎉', 'Kolejka pusta', 'Brak wniosków w tym statusie.'), skel: 'list' }, () =>
      `<div class="cols" style="grid-template-columns:340px 1fr"><div class="card pad0 convs">${list.map(a => `<a href="#/A01" data-act="app-sel" data-id="${a.id}" class="${sel.id === a.id ? 'on' : ''}"><div><b>${a.name}</b><br><span class="mut small">${a.headline}</span><br>${appStatus(a.status)} <span class="mut small">${a.submitted}</span></div></a>`).join('')}</div>
      <div class="card"><div class="row between"><h2>${sel.name}</h2>${appStatus(sel.status)}</div><p><b>${sel.headline}</b></p><p>${esc(sel.bio)}</p><div>${sel.topics.map(x => `<span class="tag">${x}</span>`).join('')}</div>
      <h3 style="margin-top:12px">Dokumenty</h3>${sel.docs.map(d => `<div>📎 ${esc(d)} <button class="btn sm sec" data-act="toast" data-m="Podgląd dokumentu (mock)">Podgląd</button></div>`).join('')}
      ${sel.comment ? `<div class="alert info" style="margin-top:12px">Komentarz: ${esc(sel.comment)}</div>` : ''}
      ${sel.status === 'pending' || sel.status === 'changes' ? `<div class="row" style="margin-top:16px"><button class="btn" data-act="app-approve" data-id="${sel.id}">Zatwierdź</button><button class="btn sec" data-act="app-decide" data-d="changes" data-id="${sel.id}">Poproś o poprawki</button><button class="btn danger" data-act="app-decide" data-d="rejected" data-id="${sel.id}">Odrzuć</button></div>` : ''}</div></div>`);
});
function setApp(id: string, status: Application['status'], comment?: string) {
  const a = S.apps.find(x => x.id === id)!; a.status = status; if (comment) a.comment = comment;
  if (id === 'aw') S.wiz.status = status === 'approved' ? 'approved' : status === 'changes' ? 'changes' : 'draft';
}
actions['app-sel'] = (el, e) => { e.preventDefault(); S.selApp = el.dataset.id!; render(); };
actions['app-approve'] = el => { setApp(el.dataset.id!, 'approved'); toast('Mentor zatwierdzony – e-mail wysłany'); render(); };
actions['app-decide'] = el => modal(`<h2>${el.dataset.d === 'changes' ? 'Poproś o poprawki' : 'Odrzuć wniosek'}</h2><form data-form="app-decide" data-id="${el.dataset.id}" data-d="${el.dataset.d}" novalidate>${field('comment', 'Komentarz dla mentora', { area: true, hint: 'Min. 10 znaków. Zostanie wysłany e-mailem.' })}<div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn ${el.dataset.d === 'rejected' ? 'danger' : ''}">Zapisz decyzję</button></div></form>`);
forms['app-decide'] = f => { if (!showErrors(f, val(f, 'comment').length >= 10 ? {} : { comment: 'Komentarz musi mieć co najmniej 10 znaków.' })) return; setApp(f.dataset.id!, f.dataset.d as any, val(f, 'comment')); closeModal(); toast('Decyzja zapisana (audyt)'); render(); };

/* ---------- A02 Zgłoszenia ---------- */
const sev = (s: ReportItem['severity']) => ({ high: badge('Wysoki', 'err'), med: badge('Średni', 'warn'), low: badge('Niski', '') })[s];
reg('A02', 'Zgłoszenia i spory', ['admin'], () => {
  const t = S.tab.reports || 'open'; const list = S.reports.filter(r => r.status === t); const sel = list.find(r => r.id === S.selReport) || list[0];
  return `<h1>Zgłoszenia i spory</h1>${tabsHtml('reports', [['open', 'Otwarte'], ['resolved', 'Rozwiązane']], 'open')}` +
    withState({ empty: list.length === 0, emptyHtml: emptyBox('✅', 'Brak zgłoszeń', t === 'open' ? 'Wszystkie zgłoszenia zostały obsłużone.' : 'Brak rozwiązanych zgłoszeń.'), skel: 'list' }, () =>
      `<div class="cols" style="grid-template-columns:340px 1fr"><div class="card pad0 convs">${list.map(r => `<a href="#/A02" data-act="rep-sel" data-id="${r.id}" class="${sel.id === r.id ? 'on' : ''}"><div>${sev(r.severity)} <b>${r.type}</b><br><span class="mut small">${r.target}</span></div></a>`).join('')}</div>
      <div class="card"><div class="row between"><h2>${sel.type}</h2>${sev(sel.severity)}</div><p class="mut small">Zgłasza: ${sel.reporter} · dotyczy: ${sel.target}</p><div class="card" style="background:var(--bg)">${esc(sel.text)}</div>
      ${sel.status === 'open' ? `<form data-form="resolve" data-id="${sel.id}" novalidate style="margin-top:16px"><div data-formerr></div>${selectField('decision', 'Decyzja', [['', 'Wybierz…'], ['dismiss', 'Oddal zgłoszenie'], ['warn', 'Ostrzeż użytkownika'], ['suspend', 'Zawieś konto']])}${field('refund', 'Zwrot dla ucznia (zł, opcjonalnie)', { type: 'number', hint: 'Maks. 150 zł (kwota sesji)' })}${field('note', 'Notatka (min. 10 znaków)', { area: true })}<button class="btn">Zapisz decyzję</button></form>` : `<div class="alert ok" style="margin-top:12px">Rozwiązano: ${esc(sel.resolution || '')}</div>`}</div></div>`);
});
actions['rep-sel'] = (el, e) => { e.preventDefault(); S.selReport = el.dataset.id!; render(); };
forms['resolve'] = f => {
  const errs: Record<string, string> = {}; if (!val(f, 'decision')) errs.decision = 'Wybierz decyzję.'; const rf = val(f, 'refund'); if (rf && (+rf < 0 || +rf > 150)) errs.refund = 'Zwrot: 0–150 zł.'; if (val(f, 'note').length < 10) errs.note = 'Notatka musi mieć co najmniej 10 znaków.';
  if (!showErrors(f, errs)) return; const r = S.reports.find(x => x.id === f.dataset.id)!; r.status = 'resolved'; r.resolution = (f.elements.namedItem('decision') as HTMLSelectElement).selectedOptions[0].text + (rf ? `, zwrot ${rf} zł` : ''); toast('Zgłoszenie rozwiązane, zgłaszający powiadomiony'); render();
};

/* ---------- A03 Użytkownicy ---------- */
function usersHtml() {
  const q = S.userQ.toLowerCase(); const list = S.users.filter(u => (!q || (u.name + u.email).toLowerCase().includes(q)) && (!S.userRole || u.role === S.userRole));
  return withState({ empty: list.length === 0, emptyHtml: emptyBox('🔍', 'Brak wyników', 'Zmień kryteria wyszukiwania.') }, () =>
    `<div class="card pad0"><table><tr><th>Użytkownik</th><th>Rola</th><th>Od</th><th>Status</th><th></th></tr>${list.map(u => `<tr><td><b>${u.name}</b><br><span class="mut small">${u.email}</span></td><td>${u.role}</td><td>${u.joined}</td><td>${u.status === 'active' ? badge('aktywny', 'ok') : badge('zawieszony', 'err')}</td><td class="right">${u.status === 'active' ? `<button class="btn sm sec" data-act="user-suspend" data-id="${u.id}">Zawieś</button>` : `<button class="btn sm" data-act="user-activate" data-id="${u.id}">Odblokuj</button>`}</td></tr>`).join('')}</table></div>`);
}
reg('A03', 'Użytkownicy', ['admin'], () => `<h1>Użytkownicy</h1><div class="row" style="margin-bottom:12px"><input type="search" placeholder="Szukaj po imieniu lub e-mailu…" value="${esc(S.userQ)}" data-input="userq" style="max-width:320px" aria-label="Szukaj użytkownika"><select data-input="userrole" style="width:auto" aria-label="Rola"><option value="">Wszystkie role</option><option value="mentee" ${S.userRole === 'mentee' ? 'selected' : ''}>Uczniowie</option><option value="mentor" ${S.userRole === 'mentor' ? 'selected' : ''}>Mentorzy</option><option value="admin" ${S.userRole === 'admin' ? 'selected' : ''}>Admini</option></select></div><div id="users">${usersHtml()}</div>`);
inputs['userq'] = el => { S.userQ = el.value; $('#users')!.innerHTML = usersHtml(); };
inputs['userrole'] = el => { S.userRole = el.value; $('#users')!.innerHTML = usersHtml(); };
actions['user-suspend'] = el => {
  if (el.dataset.id === 'u0') { toast('Nie możesz zawiesić własnego konta', 'err'); return; }
  modal(`<h2>Zawiesić użytkownika?</h2><form data-form="suspend" data-id="${el.dataset.id}" novalidate>${field('reason', 'Powód zawieszenia', { area: true, hint: 'Min. 10 znaków' })}<div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn danger">Zawieś</button></div></form>`);
};
forms['suspend'] = f => { if (!showErrors(f, val(f, 'reason').length >= 10 ? {} : { reason: 'Podaj powód (min. 10 znaków).' })) return; S.users.find(u => u.id === f.dataset.id)!.status = 'suspended'; closeModal(); toast('Konto zawieszone'); render(); };
actions['user-activate'] = el => { S.users.find(u => u.id === el.dataset.id)!.status = 'active'; toast('Konto odblokowane'); render(); };

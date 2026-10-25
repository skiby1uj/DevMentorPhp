/* ---------- M01 Kreator profilu ---------- */
const WIZ_STEPS = ['Podstawy', 'Tematy i cena', 'Weryfikacja', 'Podsumowanie'];
function wizBanner() {
  const st = S.wiz.status;
  return st === 'pending' ? `<div class="alert warn">⏳ Wniosek jest w weryfikacji (zwykle do 24 h). Edycja zostanie odblokowana po decyzji.</div>`
    : st === 'approved' ? `<div class="alert ok">✔ Profil zatwierdzony i widoczny w wyszukiwarce.</div>`
    : st === 'changes' ? `<div class="alert err">Zespół prosi o poprawki: ${esc(S.apps.find(a => a.id === 'aw')?.comment || '')}</div>` : '';
}
reg('M01', 'Profil mentora', ['mentor'], () => {
  if (S.view === 'loading') return skeleton('detail'); if (S.view === 'error') return errorBox();
  const w = S.wiz; const locked = w.status === 'pending';
  const topicChips = (k: 'topics' | 'langs', all: string[]) => `<div class="chips">${all.map(t => `<button type="button" class="chip ${w[k].includes(t) ? 'on' : ''}" data-act="wiz-chip" data-k="${k}" data-v="${t}" aria-pressed="${w[k].includes(t)}">${t}</button>`).join('')}</div>`;
  let body = '';
  if (locked || w.status === 'approved') body = `<h2>Podgląd profilu</h2><div class="mc">${avatar({ initials: w.name.split(' ').map(x => x[0]).join(''), color: '#db2777' }, 64)}<div><b>${esc(w.name)}</b><br>${esc(w.headline)}<p>${esc(w.bio)}</p>${w.topics.map(t => `<span class="tag">${t}</span>`).join('')}<p class="price">${w.price} zł/h</p></div></div>${w.status === 'approved' ? '<button class="btn sec" data-act="wiz-edit">Edytuj profil</button>' : ''}`;
  else if (w.step === 1) body = `<h2>Podstawowe informacje</h2>${field('name', 'Imię i nazwisko', { value: w.name })}${field('headline', 'Nagłówek profilu', { value: w.headline, hint: '10–80 znaków, np. „Senior PM – pomagam wejść w produkt”' })}${field('bio', 'O mnie', { area: true, value: w.bio, max: 1000, hint: '100–1000 znaków' })}`;
  else if (w.step === 2) body = `<h2>Tematy, języki i cena</h2><div class="field" data-field="topics"><label>Tematy (min. 1)</label>${topicChips('topics', TOPICS)}<div class="err" data-err="topics" role="alert"></div></div><div class="field" data-field="langs"><label>Języki (min. 1)</label>${topicChips('langs', LANGS)}<div class="err" data-err="langs" role="alert"></div></div>${field('price', 'Cena za 60 min (zł)', { type: 'number', value: w.price, hint: '20–300 zł. Prowizja platformy 20% – otrzymasz ' + (w.price ? Math.round(+w.price * 0.8) : '…') + ' zł.' })}`;
  else if (w.step === 3) body = `<h2>Weryfikacja</h2><p class="mut">Dodaj CV, dyplom lub certyfikat potwierdzający doświadczenie.</p><div class="field" data-field="doc"><label for="f-doc">Dokument (PDF/JPG/PNG, maks. 5 MB)</label><input id="f-doc" name="doc" type="file" accept=".pdf,.jpg,.jpeg,.png">${w.doc ? `<div class="hint">Dodano: ${esc(w.doc)}</div>` : ''}<div class="err" data-err="doc" role="alert"></div></div>
     <div class="field" data-field="consent"><label class="row" style="font-weight:400"><input type="checkbox" name="consent" ${w.consent ? 'checked' : ''}> Zgadzam się na weryfikację moich danych i dokumentów</label><div class="err" data-err="consent" role="alert"></div></div>`;
  else body = `<h2>Podsumowanie</h2><div class="stack"><div><b>${esc(w.name)}</b> – ${esc(w.headline)}</div><p>${esc(w.bio)}</p><div>${w.topics.map(t => `<span class="tag">${t}</span>`).join('')} ${w.langs.map(t => badge(t)).join(' ')}</div><div><b>${w.price} zł/h</b> · dokument: ${esc(w.doc)}</div></div><div class="alert info" style="margin-top:12px">Po wysłaniu wniosek trafi do weryfikacji. Poinformujemy Cię e-mailem.</div>`;
  const nav = locked || w.status === 'approved' ? '' : `<div class="row between" style="margin-top:20px"><span>${w.step > 1 ? '<button type="button" class="btn sec" data-act="wiz-back">Wstecz</button>' : ''}</span><button class="btn">${w.step === 4 ? 'Wyślij do weryfikacji' : 'Zapisz i dalej'}</button></div>`;
  return `<h1>Profil mentora</h1>${wizBanner()}<div class="card" style="max-width:720px">${locked || w.status === 'approved' ? '' : `<div class="steps">${WIZ_STEPS.map((_, i) => `<div class="${i < w.step ? 'on' : ''}"></div>`).join('')}</div><p class="mut small">Krok ${w.step} z 4 – ${WIZ_STEPS[w.step - 1]} · szkic zapisywany automatycznie</p>`}<form data-form="wiz" novalidate><div data-formerr></div>${body}${nav}</form></div>`;
});
function wizSaveFields() { const f = $('form[data-form=wiz]') as HTMLFormElement | null; if (!f) return; const w = S.wiz; const g = (n: string) => f.elements.namedItem(n) as HTMLInputElement | null;
  if (g('name')) { w.name = g('name')!.value; w.headline = g('headline')!.value; w.bio = g('bio')!.value; } if (g('price')) w.price = g('price')!.value; }
actions['wiz-chip'] = el => { wizSaveFields(); const k = el.dataset.k as 'topics' | 'langs', v = el.dataset.v!; const a = S.wiz[k]; S.wiz[k] = a.includes(v) ? a.filter(x => x !== v) : [...a, v]; render(); };
actions['wiz-back'] = () => { wizSaveFields(); S.wiz.step--; render(); };
actions['wiz-edit'] = () => { S.wiz.status = 'draft'; S.wiz.step = 1; render(); };
forms['wiz'] = f => {
  const w = S.wiz; const errs: Record<string, string> = {}; wizSaveFields();
  if (w.step === 1) { if (w.name.trim().length < 2) errs.name = 'Podaj imię i nazwisko.'; const h = w.headline.trim().length; if (h < 10 || h > 80) errs.headline = 'Nagłówek: 10–80 znaków (teraz ' + h + ').'; const b = w.bio.trim().length; if (b < 100 || b > 1000) errs.bio = 'Opis: 100–1000 znaków (teraz ' + b + ').'; }
  if (w.step === 2) { if (!w.topics.length) errs.topics = 'Wybierz co najmniej jeden temat.'; if (!w.langs.length) errs.langs = 'Wybierz co najmniej jeden język.'; const p = +w.price; if (!w.price || isNaN(p) || p < 20 || p > 300) errs.price = 'Cena musi mieścić się w przedziale 20–300 zł.'; }
  if (w.step === 3) { const fi = f.elements.namedItem('doc') as HTMLInputElement; const file = fi.files?.[0];
    if (file) { if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) errs.doc = 'Dozwolone formaty: PDF, JPG, PNG.'; else if (file.size > 5 * 1024 * 1024) errs.doc = 'Plik jest za duży (maks. 5 MB).'; else w.doc = file.name; } else if (!w.doc) errs.doc = 'Dodaj dokument potwierdzający doświadczenie.';
    w.consent = (f.elements.namedItem('consent') as HTMLInputElement).checked; if (!w.consent) errs.consent = 'Zgoda na weryfikację jest wymagana.'; }
  if (!showErrors(f, errs)) return;
  if (w.step < 4) { toast('Szkic zapisany'); w.step++; render(); return; }
  const btn = f.querySelector('button.btn:last-child') as HTMLElement; setBusy(btn, true, 'Wysyłanie…');
  setTimeout(() => { w.status = 'pending'; S.apps = S.apps.filter(a => a.id !== 'aw'); S.apps.unshift({ id: 'aw', name: w.name, headline: w.headline, topics: w.topics, docs: [w.doc], submitted: 'przed chwilą', status: 'pending', bio: w.bio }); toast('Wniosek wysłany do weryfikacji'); render(); }, 900);
};

/* ---------- M02 Dashboard ---------- */
reg('M02', 'Dashboard mentora', ['mentor'], () => withState({ emptyHtml: emptyBox('📅', 'Brak sesji', 'Uzupełnij dostępność, aby uczniowie mogli Cię rezerwować.', { label: 'Ustaw dostępność', href: '#/M03' }), skel: 'detail' }, () =>
  `<h1>Cześć, ${esc(S.name.split(' ')[0])}!</h1>${wizBanner() || `<div class="alert info">Uzupełnij profil, aby pojawić się w wyszukiwarce. <a href="#/M01">Przejdź do kreatora</a></div>`}
  <div class="grid g3"><div class="card"><div class="stat">${S.requests.length}</div><div class="mut">nowych próśb</div><a href="#/M04">Zobacz →</a></div><div class="card"><div class="stat">${S.mentorUpcoming.length}</div><div class="mut">nadchodzących sesji</div></div><div class="card"><div class="stat">${S.balance.available + S.balance.pending} zł</div><div class="mut">saldo (dostępne + oczekujące)</div><a href="#/M06">Zarobki →</a></div></div>
  <div class="card" style="margin-top:16px"><h2>Nadchodzące sesje</h2>${S.mentorUpcoming.length ? S.mentorUpcoming.map(u => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><span><b>${u.student}</b> · ${u.topic}<br><span class="mut small">${fmtDT(u.start)}</span></span><span class="row"><a class="btn sm sec" href="#/U07/${u.id}">Szczegóły</a><button class="btn sm" data-act="join" data-id="${u.id}">Wejdź do sali</button></span></div>`).join('') : emptyBox('📅', 'Brak sesji', 'Uzupełnij dostępność.', { label: 'Ustaw dostępność', href: '#/M03' })}</div>`));

/* ---------- M03 Dostępność ---------- */
const DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
reg('M03', 'Dostępność', ['mentor'], () => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);
  return `<h1>Dostępność</h1><p class="mut">Kliknij komórki, aby zaznaczyć godziny, w których przyjmujesz uczniów.</p>` + withState({ empty: S.avail.size === 0, emptyHtml: emptyBox('🗓', 'Nie masz ustawionej dostępności', 'Profil nie jest widoczny w wyszukiwarce, dopóki nie dodasz terminów.', { label: 'Dodaj typowe godziny (pon–pt 18–20)', act: 'av-preset' }), skel: 'detail' }, () =>
    `<form data-form="av-save" novalidate><div data-formerr></div><div class="card"><div class="avgrid"><span></span>${DAYS.map(d => `<span class="h">${d}</span>`).join('')}${hours.map(h => `<span class="h">${h}:00</span>${DAYS.map((_, d) => `<button type="button" class="c ${S.avail.has(d + '-' + h) ? 'on' : ''}" data-act="av" data-k="${d}-${h}" aria-label="${DAYS[d]} ${h}:00" aria-pressed="${S.avail.has(d + '-' + h)}"></button>`).join('')}`).join('')}</div></div>
    <div class="grid g3" style="margin-top:16px"><div class="card">${selectField('tz', 'Strefa czasowa', [['Europe/Warsaw', 'Europe/Warsaw'], ['Europe/Berlin', 'Europe/Berlin']])}</div><div class="card">${selectField('buf', 'Bufor między sesjami', [['0', 'Brak'], ['10', '10 min'], ['15', '15 min']], '10')}</div><div class="card">${selectField('mode', 'Tryb rezerwacji', [['auto', 'Natychmiastowa'], ['manual', 'Ręczna akceptacja']], 'manual')}</div></div>
    <div class="row between" style="margin-top:16px"><span class="mut" id="avcount">${S.avail.size} godz./tydz.${S.availSaved ? '' : ' · niezapisane zmiany'}</span><button class="btn">Zapisz dostępność</button></div></form>`);
});
actions['av'] = el => { const k = el.dataset.k!; if (S.avail.has(k)) S.avail.delete(k); else S.avail.add(k); el.classList.toggle('on'); el.setAttribute('aria-pressed', String(S.avail.has(k))); S.availSaved = false; $('#avcount')!.textContent = S.avail.size + ' godz./tydz. · niezapisane zmiany'; };
actions['av-preset'] = () => { for (let d = 0; d < 5; d++) { S.avail.add(d + '-18'); S.avail.add(d + '-19'); } S.view = 'ok'; render(); };
forms['av-save'] = f => {
  if (!showErrors(f, S.avail.size ? {} : { form: 'Dodaj przynajmniej jeden termin, aby profil był widoczny.' })) return;
  const btn = f.querySelector('button.btn') as HTMLElement; setBusy(btn, true, 'Zapisywanie…'); setTimeout(() => { S.availSaved = true; toast('Dostępność zapisana'); render(); }, 600);
};

/* ---------- M04 Prośby ---------- */
reg('M04', 'Prośby o rezerwację', ['mentor'], () => `<h1>Prośby o rezerwację</h1>` + withState({ empty: S.requests.length === 0, emptyHtml: emptyBox('📭', 'Brak nowych próśb', 'Gdy uczeń poprosi o sesję, zobaczysz ją tutaj.'), skel: 'list' }, () =>
  `<div class="stack">${S.requests.map(r => `<div class="card mc">${avatar(r, 48)}<div class="body"><div class="row between"><h3>${r.student}</h3>${badge('wygasa za ' + r.hoursLeft + ' h', r.hoursLeft < 8 ? 'err' : 'warn')}</div><p>${r.topic}<br><b>${fmtDT(r.start)}</b></p>${r.message ? `<p class="mut">„${esc(r.message)}”</p>` : ''}<div class="row"><button class="btn sm" data-act="req-accept" data-id="${r.id}">Akceptuj</button><button class="btn sm sec" data-act="req-decline" data-id="${r.id}">Odrzuć</button></div></div></div>`).join('')}</div>`));
actions['req-accept'] = el => {
  const r = S.requests.find(x => x.id === el.dataset.id)!; if (S.mentorUpcoming.some(u => +u.start === +r.start)) { toast('Kolizja terminów – masz już sesję w tym czasie', 'err'); return; }
  S.mentorUpcoming.push({ id: r.id, student: r.student, start: r.start, topic: r.topic }); S.requests = S.requests.filter(x => x !== r); toast(`Zaakceptowano – ${r.student} dostał powiadomienie`); render();
};
actions['req-decline'] = el => modal(`<h2>Odrzuć prośbę</h2><form data-form="decline" data-id="${el.dataset.id}" novalidate>${selectField('reason', 'Powód (zobaczy go uczeń)', [['', 'Wybierz…'], ['busy', 'Termin przestał być dostępny'], ['topic', 'Temat poza moim zakresem'], ['other', 'Inny']])}<p class="hint">Uczeń otrzyma pełny zwrot.</p><div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Wróć</button><button class="btn danger">Odrzuć</button></div></form>`);
forms['decline'] = f => { if (!showErrors(f, val(f, 'reason') ? {} : { reason: 'Wybierz powód odrzucenia.' })) return; S.requests = S.requests.filter(x => x.id !== f.dataset.id); closeModal(); toast('Prośba odrzucona, uczeń otrzyma zwrot'); render(); };

/* ---------- M05 Uczniowie ---------- */
function studentsHtml() {
  const q = S.studentQ.toLowerCase(); const list = S.students.map((s, i) => ({ ...s, i })).filter(s => s.name.toLowerCase().includes(q));
  return withState({ empty: list.length === 0, emptyHtml: emptyBox('🎓', q ? 'Brak wyników' : 'Nie masz jeszcze uczniów', q ? 'Spróbuj innej frazy.' : 'Uzupełnij profil i dostępność, aby zwiększyć widoczność.', q ? undefined : { label: 'Edytuj profil', href: '#/M01' }) }, () =>
    `<div class="card pad0"><table><tr><th>Uczeń</th><th>Sesje</th><th>Ostatnia</th><th>Notatka</th><th></th></tr>${list.map(s => `<tr><td><span class="row">${avatar(s, 32)} ${s.name}</span></td><td>${s.sessions}</td><td>${s.last}</td><td class="mut">${esc(s.note.slice(0, 30)) || '—'}</td><td class="right"><button class="btn sm sec" data-act="stu-note" data-i="${s.i}">Notatka</button> <a class="btn sm" href="#/U10/s${s.i}">Napisz</a></td></tr>`).join('')}</table></div>`);
}
reg('M05', 'Moi uczniowie', ['mentor'], () => `<h1>Moi uczniowie</h1><div class="field"><input type="search" placeholder="Szukaj ucznia…" value="${esc(S.studentQ)}" data-input="studq" aria-label="Szukaj ucznia" style="max-width:320px"></div><div id="stu">${studentsHtml()}</div>`);
inputs['studq'] = el => { S.studentQ = el.value; $('#stu')!.innerHTML = studentsHtml(); };
actions['stu-note'] = el => { const s = S.students[+el.dataset.i!]; modal(`<h2>Notatka o: ${s.name}</h2><form data-form="stu-note" data-i="${el.dataset.i}" novalidate>${field('note', '', { area: true, value: s.note, max: 2000, hint: 'Widoczna tylko dla Ciebie. Maks. 2000 znaków.' })}<div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn">Zapisz</button></div></form>`); };
forms['stu-note'] = f => { if (!showErrors(f, val(f, 'note').length <= 2000 ? {} : { note: 'Maks. 2000 znaków.' })) return; S.students[+f.dataset.i!].note = val(f, 'note'); closeModal(); toast('Notatka zapisana'); render(); };

/* ---------- M06 Zarobki ---------- */
function ibanValid(raw: string) { const s = raw.replace(/\s/g, '').toUpperCase(); if (!/^PL\d{26}$/.test(s)) return false; const r = s.slice(4) + s.slice(0, 4); let rem = 0; for (const ch of r) { const v = /\d/.test(ch) ? ch : String(ch.charCodeAt(0) - 55); for (const d of v) rem = (rem * 10 + +d) % 97; } return rem === 1; }
reg('M06', 'Zarobki i wypłaty', ['mentor'], () => `<h1>Zarobki i wypłaty</h1>` + withState({ empty: S.txs.length === 0, emptyHtml: emptyBox('💸', 'Brak transakcji', 'Zarobki pojawią się po pierwszej sesji.'), skel: 'detail' }, () => {
  const mo = [['Maj', 720], ['Cze', 960], ['Lip', 1100], ['Sie', 840], ['Wrz', 1260], ['Paź', 1044]] as [string, number][];
  return `<div class="grid g3"><div class="card"><div class="stat">${S.balance.available} zł</div><div class="mut">dostępne do wypłaty</div></div><div class="card"><div class="stat">${S.balance.pending} zł</div><div class="mut">oczekujące (T+7)</div></div><div class="card"><div class="stat">${S.balance.paid} zł</div><div class="mut">wypłacone łącznie</div></div></div>
  <div class="cols-r" style="margin-top:16px"><div class="stack"><div class="card"><h2>Przychody miesięczne</h2><div class="bars" style="margin-bottom:28px">${mo.map(m => `<div style="height:${m[1] / 1260 * 100}%" title="${m[1]} zł"><span>${m[0]}</span></div>`).join('')}</div></div>
   <div class="card pad0"><table><tr><th>Data</th><th>Opis</th><th>Kwota</th><th>Status</th></tr>${S.txs.map(t => `<tr><td>${t.date}</td><td>${t.desc}</td><td style="color:${t.amount < 0 ? 'var(--err)' : 'var(--ok)'}">${t.amount} zł</td><td>${t.status}</td></tr>`).join('')}</table></div></div>
   <form class="card" data-form="payout" novalidate><h2>Wypłata</h2><div data-formerr></div>${field('amount', 'Kwota (zł)', { type: 'number', hint: `Min. 50 zł, maks. ${S.balance.available} zł` })}${field('iban', 'Numer konta (IBAN)', { value: S.payoutIban, ph: 'PL61 1090 1014 0000 0712 1981 2874', hint: 'Demo: PL61109010140000071219812874' })}<button class="btn block">Zleć wypłatę</button></form></div>`;
}));
forms['payout'] = f => {
  const errs: Record<string, string> = {}; const amt = +val(f, 'amount');
  if (!val(f, 'amount') || isNaN(amt)) errs.amount = 'Podaj kwotę wypłaty.'; else if (amt < 50) errs.amount = 'Minimalna kwota wypłaty to 50 zł.'; else if (amt > S.balance.available) errs.amount = `Kwota przekracza dostępne środki (${S.balance.available} zł).`;
  if (!ibanValid(val(f, 'iban'))) errs.iban = 'Niepoprawny numer IBAN (PL + 26 cyfr).';
  if (!showErrors(f, errs)) return; const btn = f.querySelector('button.btn') as HTMLElement; setBusy(btn, true, 'Zlecanie…');
  setTimeout(() => { S.balance.available -= amt; S.balance.paid += amt; S.payoutIban = val(f, 'iban'); S.txs.unshift({ date: 'dziś', desc: 'Wypłata na konto', amount: -amt, status: 'W realizacji' }); toast('Wypłata zlecona – środki dotrą w 1–2 dni'); render(); }, 900);
};

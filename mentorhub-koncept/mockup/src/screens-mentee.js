"use strict";
const nextBooking = () => S.bookings.filter(b => b.status === 'upcoming' || b.status === 'pending').sort((a, b) => +a.start - +b.start)[0];
const lessonLabel = { trial: 'Lekcja próbna (30 min)', single: 'Lekcja 60 min', pack: 'Pakiet 5 lekcji (−10%)' };
/* ---------- U01 Onboarding ---------- */
reg('U01', 'Onboarding', ['mentee'], () => {
    const p = S.prefs;
    const step = p.step;
    const body = step === 1 ? `<h2>Czego chcesz się nauczyć?</h2><div class="field" data-field="goal"><div class="grid g2">${TOPICS.slice(0, 6).map(t => `<button type="button" class="opt ${p.goal === t ? 'on' : ''}" data-act="pref-goal" data-t="${t}">${t}</button>`).join('')}</div><div class="err" data-err="goal" role="alert"></div></div>`
        : step === 2 ? `<h2>Twój poziom i budżet</h2>${selectField('level', 'Poziom zaawansowania', [['beginner', 'Początkujący'], ['mid', 'Średniozaawansowany'], ['adv', 'Zaawansowany']], p.level)}
       <div class="field" data-field="budget"><label for="f-budget">Budżet za godzinę: <b id="bv">${p.budget} zł</b></label><input id="f-budget" name="budget" type="range" min="20" max="500" step="10" value="${p.budget}" data-input="pref" style="width:100%"><div class="err" data-err="budget"></div></div>`
            : `<h2>Kiedy wolisz się uczyć?</h2><div class="field">${['Rano (6–10)', 'Południe (10–16)', 'Popołudnie (16–19)', 'Wieczór (19–22)', 'Weekendy'].map(t => `<label class="row" style="margin-bottom:8px"><input type="checkbox" name="times" value="${t}" ${p.times.includes(t) ? 'checked' : ''}> ${t}</label>`).join('')}</div><p class="hint">Strefa czasowa: Europe/Warsaw (zmienisz w ustawieniach).</p>`;
    return `<div class="card" style="max-width:620px;margin:10px auto"><div class="steps">${[1, 2, 3].map(i => `<div class="${i <= step ? 'on' : ''}"></div>`).join('')}</div>
   <p class="mut small">Krok ${step} z 3</p><form data-form="onboard" novalidate>${body}<div class="row between" style="margin-top:20px"><a href="#/U02" class="btn ghost">Pomiń</a>
   <span class="row">${step > 1 ? '<button type="button" class="btn sec" data-act="pref-back">Wstecz</button>' : ''}<button class="btn">${step === 3 ? 'Zakończ' : 'Dalej'}</button></span></div></form></div>`;
});
actions['pref-goal'] = el => { S.prefs.goal = el.dataset.t; render(); };
actions['pref-back'] = () => { S.prefs.step--; render(); };
inputs['pref'] = el => { S.prefs.budget = +el.value; $('#bv').textContent = el.value + ' zł'; };
forms['onboard'] = f => {
    const p = S.prefs;
    if (p.step === 1 && !p.goal) {
        showErrors(f, { goal: 'Wybierz, czego chcesz się uczyć.' });
        return;
    }
    if (p.step === 2) {
        p.level = val(f, 'level');
        if (p.budget < 20 || p.budget > 500) {
            showErrors(f, { budget: 'Budżet: 20–500 zł.' });
            return;
        }
    }
    if (p.step === 3) {
        p.times = Array.from(f.querySelectorAll('input[name=times]:checked')).map(i => i.value);
        p.done = true;
        p.step = 1;
        toast('Preferencje zapisane – oto rekomendacje!');
        go('#/U02');
        return;
    }
    p.step++;
    render();
};
/* ---------- U02 Dashboard ---------- */
reg('U02', 'Dashboard', ['mentee'], () => withState({ emptyHtml: emptyBox('📅', 'Nie masz zaplanowanych sesji', 'Znajdź mentora i umów lekcję próbną.', { label: 'Znajdź mentora', href: '#/P02' }), skel: 'detail' }, () => {
    const nb = nextBooking();
    const done = S.bookings.filter(b => b.status === 'done');
    const toReview = done.filter(b => !b.reviewed);
    const rec = (S.prefs.goal ? MENTORS.filter(m => m.topics.includes(S.prefs.goal)) : MENTORS).slice(0, 2);
    const mins = nb ? minutesTo(nb.start) : 0;
    return `<h1>Cześć, ${esc(S.name.split(' ')[0])} 👋</h1><div class="cols-r"><div class="stack">
  <div class="card"><h2>Najbliższa sesja</h2>${nb ? (() => {
        const m = mentorById(nb.mentorId);
        return `<div class="mc">${avatar(m, 56)}<div class="body"><h3>${nb.topic} z ${m.name}</h3><p>${fmtDT(nb.start)} · ${nb.durationMin} min ${statusBadge(nb.status)}</p><p class="mut small">Start za ${mins > 1440 ? Math.floor(mins / 1440) + ' d ' + Math.floor((mins % 1440) / 60) + ' h' : Math.floor(mins / 60) + ' h ' + (mins % 60) + ' min'}</p>
    <div class="row"><button class="btn" data-act="join" data-id="${nb.id}">Dołącz do sali</button><a class="btn sec" href="#/U07/${nb.id}">Szczegóły</a></div><p class="hint">W wersji produkcyjnej przycisk „Dołącz” jest aktywny 10 min przed startem – w mockupie zawsze dostępny.</p></div></div>`;
    })()
        : emptyBox('📅', 'Brak zaplanowanych sesji', 'Umów pierwszą lekcję.', { label: 'Znajdź mentora', href: '#/P02' })}</div>
  <div class="card"><h2>Do zrobienia</h2>${toReview.length ? toReview.map(b => `<div class="row between"><span>⭐ Wystaw opinię: ${mentorById(b.mentorId).name}</span><a class="btn sm" href="#/U09/${b.id}">Oceń</a></div>`).join('') : '<p class="mut">Wszystko zrobione ✔</p>'}</div>
  <div class="card"><h2>${S.prefs.goal ? 'Polecani dla: ' + S.prefs.goal : 'Polecani mentorzy'}</h2><div class="stack">${rec.map(m => mentorCard(m)).join('')}</div></div></div>
  <aside class="stack"><div class="card"><div class="stat">${done.length}</div><div class="mut">odbytych sesji</div></div><div class="card"><div class="stat">${done.reduce((a, b) => a + b.durationMin, 0) / 60} h</div><div class="mut">czas nauki</div></div>
  ${!S.prefs.done ? `<div class="alert info">Uzupełnij preferencje, aby dostać lepsze rekomendacje. <a href="#/U01">Rozpocznij</a></div>` : ''}</aside></div>`;
}));
actions['join'] = el => { S.roomStart = Date.now(); S.roomMic = true; S.roomCam = true; S.roomShare = false; roomChat.length = 0; go('#/U08/' + el.dataset.id); };
/* ---------- U03 Rezerwacja ---------- */
function draftPrice() { const d = S.draft; const m = mentorById(d.mentorId); const base = d.type === 'trial' ? m.trial : d.type === 'single' ? m.price : m.price * 5 * 0.9; return Math.max(0, base - d.promo); }
reg('U03', 'Rezerwacja', ['mentee'], id => {
    const m = MENTORS.find(x => x.id === id);
    if (!m)
        return emptyBox('🕳️', 'Mentor niedostępny', '', { label: 'Wróć', href: '#/P02' });
    if (!S.draft || S.draft.mentorId !== id)
        S.draft = { mentorId: id, type: 'trial', slot: '', note: '', promo: 0 };
    const d = S.draft;
    const slots = mentorSlots(m);
    const noSlots = slots.every(s => s.times.length === 0);
    const cal = withState({ empty: noSlots, emptyHtml: emptyBox('📭', 'Brak wolnych terminów w tym tygodniu', 'Napisz do mentora lub sprawdź ponownie później.', { label: 'Napisz do mentora', href: '#/U10/' + m.id }), skel: 'detail', errText: 'Nie udało się pobrać terminów mentora.' }, () => `<div class="slots">${slots.map(s => `<div><h4>${fmtDay(s.day)}</h4>${s.times.length ? s.times.map(t => { const k = slotKey(s.day, t); return `<button type="button" class="slot ${d.slot === k ? 'on' : ''}" data-act="slot" data-k="${k}" aria-pressed="${d.slot === k}">${t}</button>`; }).join('') : '<div class="mut small" style="text-align:center">—</div>'}</div>`).join('')}</div>`);
    return `<div class="steps"><div class="on"></div><div></div><div></div></div><div class="bc">Krok 1 z 3 · <a href="#/P03/${m.id}">← ${m.name}</a></div>
  <div class="cols-r"><form class="stack" data-form="book-next" novalidate>
   <div class="card"><h2>Rodzaj lekcji</h2><div class="grid g3">${['trial', 'single', 'pack'].map(t => `<button type="button" class="opt ${d.type === t ? 'on' : ''}" data-act="lt" data-t="${t}"><b>${lessonLabel[t]}</b><br><span class="mut small">${t === 'trial' ? m.trial : t === 'single' ? m.price : m.price * 0.9} zł${t === 'pack' ? ' / lekcja ×5' : ''}</span></button>`).join('')}</div></div>
   <div class="card"><h2>Wybierz termin</h2><p class="hint">Godziny w Twojej strefie: Europe/Warsaw</p><div data-field="slot">${cal}<div class="err" data-err="slot" role="alert"></div></div></div>
   <div class="card">${field('note', 'Wiadomość do mentora (opcjonalnie)', { area: true, max: 500, value: d.note, hint: 'Maks. 500 znaków – opisz swój cel.' }).replace('<textarea', '<textarea data-input="note"')}</div></form>
   <aside class="card sticky"><h3>Podsumowanie</h3><div class="mc">${avatar(m, 44)}<div><b>${m.name}</b><br><span class="mut small">${lessonLabel[d.type]}</span></div></div><div class="divider"></div>
    <p>Termin: <b>${d.slot ? fmtDT(slotDate(d.slot)) : '—'}</b></p><p class="row between"><span>Do zapłaty</span><span class="price">${pln(draftPrice())}</span></p>
    ${m.manual ? '<div class="alert info small">Mentor akceptuje prośby ręcznie (do 24 h). Środki zostaną zablokowane, nie pobrane.</div>' : ''}
    <button class="btn block" data-act="book-submit">Przejdź do płatności</button></aside></div>`;
});
actions['lt'] = el => { S.draft.type = el.dataset.t; render(); };
actions['slot'] = el => { S.draft.slot = el.dataset.k; render(); };
inputs['note'] = el => { S.draft.note = el.value; };
actions['book-submit'] = () => { const f = $('form[data-form=book-next]'); f.requestSubmit(); };
forms['book-next'] = f => {
    const d = S.draft;
    d.note = val(f, 'note');
    const errs = {};
    if (!d.slot)
        errs.slot = 'Wybierz termin lekcji.';
    else if (slotDate(d.slot).getTime() < Date.now() + 2 * 3600e3)
        errs.slot = 'Termin musi być co najmniej 2 godziny w przyszłości.';
    if (d.note.length > 500)
        errs.note = 'Maksymalnie 500 znaków.';
    if (showErrors(f, errs))
        go('#/U04/' + d.mentorId);
};
/* ---------- U04 Płatność ---------- */
reg('U04', 'Płatność', ['mentee'], () => {
    const d = S.draft;
    if (!d || !d.slot)
        return emptyBox('🧾', 'Brak rezerwacji do opłacenia', 'Wybierz najpierw termin lekcji.', { label: 'Znajdź mentora', href: '#/P02' });
    const m = mentorById(d.mentorId);
    const card = S.cards[0];
    return `<div class="steps"><div class="on"></div><div class="on"></div><div></div></div><div class="bc">Krok 2 z 3 · <a href="#/U03/${m.id}">← Zmień termin</a></div>
  <div class="cols-r"><form class="card" data-form="pay" novalidate><h2>Płatność</h2><div data-formerr></div>
   <div class="field"><label for="f-pm">Metoda płatności</label><select id="f-pm" name="pm" data-input="paymethod">${card ? `<option value="saved">${card.brand} •••• ${card.last4} (${card.exp})</option>` : ''}<option value="new">Nowa karta</option></select></div>
   <div id="newcard" style="display:${card ? 'none' : 'block'}">${cardFields()}</div>
   <div class="field" data-field="terms"><label class="row" style="font-weight:400"><input type="checkbox" name="terms"> Akceptuję regulamin oraz politykę zwrotów (pełny zwrot do 24 h przed sesją)</label><div class="err" data-err="terms" role="alert"></div></div>
   <button class="btn block">Zapłać ${pln(draftPrice())}</button><p class="hint">🔒 Dane karty przetwarza operator płatności. Środki są zwalniane mentorowi po sesji.</p></form>
  <aside class="card"><h3>Zamówienie</h3><p>${lessonLabel[d.type]} – ${m.name}</p><p>${fmtDT(slotDate(d.slot))}</p><div class="divider"></div>
   <div class="field" data-field="promo"><label for="f-promo">Kod promocyjny</label><div class="row"><input id="f-promo" type="text" placeholder="np. WITAJ10" style="flex:1;width:auto"><button type="button" class="btn sec" data-act="promo">Zastosuj</button></div><div class="err" data-err="promo" role="alert"></div>${d.promo ? `<div class="alert ok small">Zniżka: −${d.promo} zł</div>` : ''}</div>
   <div class="row between"><b>Razem</b><span class="price">${pln(draftPrice())}</span></div></aside></div>`;
});
inputs['paymethod'] = el => { $('#newcard').style.display = el.value === 'new' ? 'block' : 'none'; };
actions['promo'] = () => {
    const v = ($('#f-promo').value || '').trim().toUpperCase();
    const w = $('[data-field=promo]');
    if (v === 'WITAJ10') {
        S.draft.promo = 10;
        toast('Kod zastosowany: −10 zł');
        render();
    }
    else {
        w.classList.add('bad');
        $('[data-err=promo]').textContent = v ? 'Kod nieprawidłowy lub wygasły.' : 'Wpisz kod promocyjny.';
    }
};
forms['pay'] = f => {
    const errs = val(f, 'pm') === 'new' ? validateCard(f) : {};
    if (!f.elements.namedItem('terms').checked)
        errs.terms = 'Zaakceptuj regulamin, aby kontynuować.';
    if (!showErrors(f, errs))
        return;
    const btn = f.querySelector('button.btn:last-of-type');
    setBusy(btn, true, 'Przetwarzamy płatność…');
    const declined = val(f, 'pm') === 'new' && val(f, 'cardnum').replace(/\s/g, '') === '4000000000000002';
    setTimeout(() => {
        setBusy(btn, false);
        if (declined) {
            showErrors(f, { form: 'Płatność odrzucona przez bank (card_declined). Użyj innej karty.' });
            return;
        }
        if (S.view === 'error') {
            showErrors(f, { form: 'Usługa płatności jest chwilowo niedostępna. Spróbuj ponownie.' });
            return;
        }
        const d = S.draft, m = mentorById(d.mentorId);
        const b = { id: 'b' + (S.bookings.length + 10), mentorId: m.id, start: slotDate(d.slot), durationMin: d.type === 'trial' ? 30 : 60, topic: d.type === 'trial' ? 'Lekcja próbna' : 'Sesja mentoringowa', status: m.manual ? 'pending' : 'upcoming', price: draftPrice(), reviewed: false, note: '' };
        S.bookings.push(b);
        if (!S.convs[m.id])
            S.convs[m.id] = [];
        if (d.note)
            S.convs[m.id].push({ from: 'me', text: d.note, time: 'teraz' });
        S.draft = null;
        go('#/U05/' + b.id);
    }, 1200);
};
/* ---------- U05 ---------- */
reg('U05', 'Potwierdzenie', ['mentee'], id => {
    const b = S.bookings.find(x => x.id === id);
    if (!b)
        return emptyBox('🕳️', 'Nie znaleziono rezerwacji', '', { label: 'Moje sesje', href: '#/U06' });
    const m = mentorById(b.mentorId);
    const pend = b.status === 'pending';
    return `<div class="steps"><div class="on"></div><div class="on"></div><div class="on"></div></div><div class="card" style="max-width:560px;margin:auto;text-align:center"><div style="font-size:48px">${pend ? '⏳' : '🎉'}</div>
   <h1>${pend ? 'Prośba wysłana' : 'Zarezerwowano!'}</h1><p class="mut">${pend ? `${m.name} odpowie w ciągu 24 godzin. Środki są zablokowane, nie pobrane.` : 'Wysłaliśmy potwierdzenie e-mailem. Przypomnimy Ci 24 h i 1 h przed sesją.'}</p>
   <div class="card" style="text-align:left;background:var(--bg)"><div class="mc">${avatar(m, 44)}<div><b>${m.name}</b><br>${b.topic} · ${b.durationMin} min<br>${fmtDT(b.start)}<br><b>${pln(b.price)}</b></div></div></div>
   <div class="row" style="justify-content:center;margin-top:16px"><button class="btn sec" data-act="toast" data-m="Pobrano plik .ics">📅 Dodaj do kalendarza</button><a class="btn sec" href="#/U10/${m.id}">Napisz do mentora</a><a class="btn" href="#/U06">Moje sesje</a></div></div>`;
});
/* ---------- U06 ---------- */
actions['tab'] = el => { S.tab[el.dataset.k] = el.dataset.v; render(); };
const tabsHtml = (k, items, def) => `<div class="tabs" role="tablist">${items.map(i => `<button class="tab ${(S.tab[k] || def) === i[0] ? 'on' : ''}" role="tab" data-act="tab" data-k="${k}" data-v="${i[0]}">${i[1]}</button>`).join('')}</div>`;
reg('U06', 'Moje sesje', ['mentee'], () => {
    const t = S.tab.sessions || 'upcoming';
    const list = S.bookings.filter(b => t === 'upcoming' ? b.status === 'upcoming' || b.status === 'pending' : b.status === t).sort((a, b) => +a.start - +b.start);
    const msgs = { upcoming: 'Nie masz nadchodzących sesji.', done: 'Nie odbyłeś jeszcze żadnej sesji.', cancelled: 'Brak anulowanych sesji.' };
    return `<h1>Moje sesje</h1>${tabsHtml('sessions', [['upcoming', 'Nadchodzące'], ['done', 'Zakończone'], ['cancelled', 'Anulowane']], 'upcoming')}` +
        withState({ empty: list.length === 0, emptyHtml: emptyBox('📅', msgs[t], 'Umów lekcję z mentorem.', { label: 'Znajdź mentora', href: '#/P02' }) }, () => `<div class="stack">${list.map(b => {
            const m = mentorById(b.mentorId);
            return `<div class="card mc">${avatar(m, 48)}<div class="body"><div class="row between"><h3>${b.topic} – ${m.name}</h3>${statusBadge(b.status)}</div><p class="mut">${fmtDT(b.start)} · ${b.durationMin} min · ${pln(b.price)}</p>
      <div class="row"><a class="btn sm sec" href="#/U07/${b.id}">Szczegóły</a>${b.status === 'upcoming' ? `<button class="btn sm" data-act="join" data-id="${b.id}">Dołącz</button>` : ''}${b.status === 'done' && !b.reviewed ? `<a class="btn sm" href="#/U09/${b.id}">Wystaw opinię</a>` : ''}</div></div></div>`;
        }).join('')}</div>`);
});
/* ---------- U07 ---------- */
function sessionInfo(id) {
    if (S.role === 'mentor') {
        const u = S.mentorUpcoming.find(x => x.id === id);
        if (u)
            return { who: { name: u.student, initials: u.student.split(' ').map(s => s[0]).join(''), color: '#0891b2' }, start: u.start, topic: u.topic, status: 'upcoming', price: 144, dur: 60, b: undefined, mid: '' };
    }
    const b = S.bookings.find(x => x.id === id);
    if (!b)
        return null;
    const m = mentorById(b.mentorId);
    return { who: m, start: b.start, topic: b.topic, status: b.status, price: b.price, dur: b.durationMin, b, mid: m.id };
}
reg('U07', 'Szczegóły sesji', ['mentee', 'mentor'], id => {
    if (S.view === 'loading')
        return skeleton('detail');
    if (S.view === 'error')
        return errorBox();
    const s = sessionInfo(id);
    if (!s)
        return emptyBox('🕳️', 'Sesja nie istnieje', 'Mogła zostać usunięta lub nie masz do niej dostępu (404/403).', { label: 'Wróć', href: homeFor(S.role) });
    const free = minutesTo(s.start) > 1440;
    const mentee = S.role === 'mentee';
    return `<div class="bc"><a href="${mentee ? '#/U06' : '#/M02'}">← ${mentee ? 'Moje sesje' : 'Dashboard'}</a></div><div class="cols-r"><div class="stack"><div class="card"><div class="row between"><h1>${s.topic}</h1>${statusBadge(s.status)}</div>
   <div class="mc">${avatar(s.who, 56)}<div><b>${s.who.name}</b><br>${fmtDT(s.start)} · ${s.dur} min<br><span class="mut small">Europe/Warsaw · ${pln(s.price)}</span></div></div></div>
   <div class="card"><h2>Notatki</h2>${s.b && (s.b.note || S.view !== 'empty') ? `<form data-form="notes" data-id="${id}">${field('note', '', { area: true, value: s.b.note || '', max: 2000, ph: 'Dodaj notatki z sesji…' })}<button class="btn sm">Zapisz notatki</button></form>` : emptyBox('📝', 'Brak notatek', 'Notatki pojawią się po sesji.')}</div></div>
   <aside class="card stack"><h3>Akcje</h3>
   ${s.status === 'upcoming' ? `<button class="btn block" data-act="join" data-id="${id}">Wejdź do sali</button>` : ''}
   ${mentee && (s.status === 'upcoming' || s.status === 'pending') ? `<button class="btn sec block" data-act="resched-open" data-id="${id}">Zmień termin</button><button class="btn sec block" data-act="cancel-open" data-id="${id}">Anuluj sesję</button><p class="hint">${free ? 'Anulowanie >24 h przed startem: pełny zwrot.' : 'Poniżej 24 h do startu zwrot nie przysługuje.'}</p>` : ''}
   ${mentee && s.status === 'done' && s.b && !s.b.reviewed ? `<a class="btn block" href="#/U09/${id}">Wystaw opinię</a>` : ''}
   ${mentee && s.mid ? `<a class="btn sec block" href="#/U03/${s.mid}">Zarezerwuj ponownie</a><a class="btn sec block" href="#/U10/${s.mid}">Napisz do mentora</a>` : ''}
   <button class="btn ghost block" data-act="toast" data-m="Zgłoszenie problemu wysłane do wsparcia">🚩 Zgłoś problem</button></aside></div>`;
});
forms['notes'] = f => { const b = S.bookings.find(x => x.id === f.dataset.id); if (b)
    b.note = val(f, 'note'); toast('Notatki zapisane'); };
actions['cancel-open'] = el => {
    const b = S.bookings.find(x => x.id === el.dataset.id);
    const free = minutesTo(b.start) > 1440;
    modal(`<h2>Anulować sesję?</h2><div class="alert ${free ? 'ok' : 'warn'}">${free ? 'Otrzymasz pełny zwrot ' + pln(b.price) + '.' : 'Do startu mniej niż 24 h – zwrot nie przysługuje.'}</div>
  <form data-form="cancel" data-id="${b.id}" novalidate>${selectField('reason', 'Powód anulowania', [['', 'Wybierz…'], ['time', 'Zmiana planów'], ['mentor', 'Wybrałem innego mentora'], ['other', 'Inny']])}
  <div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Wróć</button><button class="btn danger">Anuluj sesję</button></div></form>`);
};
forms['cancel'] = f => {
    if (!showErrors(f, val(f, 'reason') ? {} : { reason: 'Wybierz powód anulowania.' }))
        return;
    const b = S.bookings.find(x => x.id === f.dataset.id);
    b.status = 'cancelled';
    closeModal();
    toast(minutesTo(b.start) > 1440 ? 'Sesja anulowana – zwrot w drodze' : 'Sesja anulowana', 'ok');
    go('#/U06');
};
actions['resched-open'] = el => {
    const b = S.bookings.find(x => x.id === el.dataset.id);
    const m = mentorById(b.mentorId);
    const opts = mentorSlots(m).flatMap(s => s.times.map(t => ({ k: slotKey(s.day, t), l: fmtDay(s.day) + ', ' + t }))).slice(0, 8);
    modal(`<h2>Zmień termin</h2><form data-form="resched" data-id="${b.id}" novalidate><div class="field" data-field="slot"><div class="grid g2">${opts.map(o => `<label class="opt row"><input type="radio" name="slot" value="${o.k}"> ${o.l}</label>`).join('')}</div><div class="err" data-err="slot" role="alert"></div></div>
  <div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn">Zmień termin</button></div></form>`);
};
forms['resched'] = f => {
    const sel = f.querySelector('input[name=slot]:checked');
    if (!showErrors(f, sel ? {} : { slot: 'Wybierz nowy termin.' }))
        return;
    const b = S.bookings.find(x => x.id === f.dataset.id);
    b.start = slotDate(sel.value);
    closeModal();
    toast('Termin zmieniony – mentor został powiadomiony');
    render();
};
/* ---------- U08 Sala ---------- */
const roomChat = [];
const roomTimer = () => { const s = Math.floor((Date.now() - S.roomStart) / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
reg('U08', 'Sala wideo', ['mentee', 'mentor'], id => {
    const s = sessionInfo(id);
    if (!s)
        return emptyBox('🕳️', 'Sesja nie istnieje', '', { label: 'Wróć', href: homeFor(S.role) });
    if (S.view === 'loading')
        return `<div class="room" style="text-align:center;padding:80px 20px"><div class="spin" style="margin:auto;width:32px;height:32px"></div><h2>Łączenie z salą…</h2><p>Sprawdzamy kamerę i mikrofon</p></div>`;
    if (S.view === 'error')
        return `<div class="room" style="text-align:center;padding:60px 20px"><div style="font-size:40px">🚫</div><h2>Brak dostępu do kamery lub mikrofonu</h2><p>Zezwól na dostęp w ustawieniach przeglądarki i spróbuj ponownie.</p><button class="btn" data-act="retry">Spróbuj ponownie</button></div>`;
    const wait = S.view === 'empty';
    return `<div class="row between"><h2>${s.topic} · ${s.who.name}</h2><span class="badge p">⏱ <span id="timer">${roomTimer()}</span></span></div>
  <div class="cols-r"><div class="room"><div style="position:relative"><div class="vid">${wait ? '<div style="text-align:center"><div class="spin" style="margin:auto"></div><p>Czekamy na drugą osobę… (sygnał no-show po 10 min)</p></div>' : avatar(s.who, 96)}<span class="lbl">${s.who.name}</span></div>
   <div class="vid pip">${S.roomCam ? avatar({ initials: S.name.split(' ').map(x => x[0]).join(''), color: '#4f46e5' }, 48) : '<span>📷 wyłączona</span>'}<span class="lbl">Ty</span></div></div>
   ${S.roomShare ? '<div class="alert info" style="margin-top:10px">Udostępniasz ekran</div>' : ''}
   <div class="ctrl"><button class="btn ${S.roomMic ? '' : 'off'}" data-act="room-mic" aria-pressed="${S.roomMic}">${S.roomMic ? '🎤 Mikrofon' : '🔇 Wyciszony'}</button><button class="btn ${S.roomCam ? '' : 'off'}" data-act="room-cam" aria-pressed="${S.roomCam}">${S.roomCam ? '📷 Kamera' : '🚫 Kamera wył.'}</button><button class="btn" data-act="room-share">🖥 ${S.roomShare ? 'Zatrzymaj' : 'Udostępnij ekran'}</button><button class="btn end" data-act="room-end" data-id="${id}">Zakończ</button></div></div>
  <aside class="stack"><div class="card"><h3>Czat</h3><div class="msgs" id="rchat" style="height:170px">${roomChat.length ? roomChat.map(c => `<div class="bub ${c.me ? 'me' : ''}">${esc(c.text)}</div>`).join('') : '<span class="mut small">Brak wiadomości</span>'}</div>
   <form data-form="room-chat" class="row" novalidate><input type="text" name="m" placeholder="Napisz…" maxlength="1000" style="flex:1;width:auto" aria-label="Wiadomość"><button class="btn sm">Wyślij</button></form></div>
   <div class="card"><h3>Wspólne notatki</h3><textarea placeholder="Notatki z sesji…"></textarea></div></aside></div>`;
});
after['U08'] = () => { const t = window.setInterval(() => { const e = $('#timer'); if (e)
    e.textContent = roomTimer();
else
    clearInterval(t); }, 1000); };
actions['room-mic'] = () => { S.roomMic = !S.roomMic; render(); };
actions['room-cam'] = () => { S.roomCam = !S.roomCam; render(); };
actions['room-share'] = () => { S.roomShare = !S.roomShare; render(); };
forms['room-chat'] = f => { const v = val(f, 'm'); if (!v)
    return; roomChat.push({ me: true, text: v }); render(); };
actions['room-end'] = el => {
    if (!confirm('Zakończyć sesję?'))
        return;
    const id = el.dataset.id;
    if (S.role === 'mentee') {
        const b = S.bookings.find(x => x.id === id);
        if (b && b.status === 'upcoming')
            b.status = 'done';
        toast('Sesja zakończona');
        go('#/U09/' + id);
    }
    else {
        toast('Sesja zakończona – środki trafią do salda oczekującego');
        go('#/M02');
    }
};
/* ---------- U09 ---------- */
let rating = 0;
reg('U09', 'Opinia po sesji', ['mentee'], id => {
    const b = S.bookings.find(x => x.id === id);
    if (!b)
        return emptyBox('🕳️', 'Nie znaleziono sesji', '', { label: 'Moje sesje', href: '#/U06' });
    const m = mentorById(b.mentorId);
    if (b.reviewed)
        return `<div class="card" style="max-width:520px;margin:auto"><div class="alert warn">Opinia dla tej sesji została już wystawiona (409).</div><a class="btn" href="#/U02">Wróć do dashboardu</a></div>`;
    rating = 0;
    return `<div class="card" style="max-width:560px;margin:auto"><h1>Jak minęła sesja?</h1><div class="mc">${avatar(m, 48)}<div><b>${m.name}</b><br><span class="mut small">${b.topic} · ${fmtDT(b.start)}</span></div></div>
  <form data-form="review" data-id="${b.id}" novalidate><div class="field" data-field="rating"><label>Twoja ocena</label><div class="star-in" role="radiogroup" aria-label="Ocena">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-act="star" data-n="${n}" aria-label="${n} z 5">★</button>`).join('')}</div><div class="err" data-err="rating" role="alert"></div></div>
  <div class="field"><label>Co się podobało?</label><div class="chips">${['Jasno tłumaczy', 'Dobrze przygotowany', 'Konkretne wskazówki', 'Cierpliwy'].map(t => `<label class="chip"><input type="checkbox" name="tags" value="${t}" hidden> ${t}</label>`).join('')}</div></div>
  ${field('text', 'Komentarz (opcjonalnie)', { area: true, max: 1000, hint: 'Maks. 1000 znaków. Opinia będzie publiczna.' })}
  <div class="row between"><a href="#/U02" class="btn ghost">Pomiń</a><button class="btn">Opublikuj opinię</button></div></form></div>`;
});
actions['star'] = el => { rating = +el.dataset.n; document.querySelectorAll('.star-in button').forEach((b, i) => b.classList.toggle('on', i < rating)); };
forms['review'] = f => {
    const errs = {};
    if (!rating)
        errs.rating = 'Wybierz ocenę od 1 do 5.';
    if (val(f, 'text').length > 1000)
        errs.text = 'Maksymalnie 1000 znaków.';
    if (!showErrors(f, errs))
        return;
    const b = S.bookings.find(x => x.id === f.dataset.id);
    const btn = f.querySelector('button.btn:last-child');
    setBusy(btn, true, 'Publikowanie…');
    setTimeout(() => { b.reviewed = true; toast('Dziękujemy za opinię! ⭐'); go('#/U02'); }, 700);
};
/* ---------- U10 Wiadomości ---------- */
function convPartners() {
    return S.role === 'mentor' ? S.students.map((s, i) => ({ id: 's' + i, ...s })) : MENTORS.filter(m => S.convs[m.id]).map(m => m);
}
reg('U10', 'Wiadomości', ['mentee', 'mentor'], id => {
    if (S.role === 'mentee' && id && MENTORS.some(m => m.id === id) && !S.convs[id])
        S.convs[id] = [];
    const ps = convPartners();
    return `<h1>Wiadomości</h1>` + withState({ empty: ps.length === 0, emptyHtml: emptyBox('💬', 'Nie masz jeszcze wiadomości', 'Napisz do mentora z jego profilu.', { label: 'Znajdź mentora', href: '#/P02' }) }, () => {
        const cur = ps.find(p => p.id === id) || ps[0];
        const th = S.convs[cur.id] || [];
        return `<div class="cols" style="grid-template-columns:300px 1fr"><div class="card pad0 convs">${ps.map(p => `<a href="#/U10/${p.id}" class="${p.id === cur.id ? 'on' : ''}">${avatar(p, 40)}<div><b>${p.name}</b><br><span class="mut small">${esc((S.convs[p.id] || []).slice(-1)[0]?.text.slice(0, 32) || 'Nowa rozmowa')}</span></div></a>`).join('')}</div>
    <div class="card pad0 chat"><div class="row between" style="padding:12px 16px;border-bottom:1px solid var(--line)"><b>${cur.name}</b>${S.role === 'mentee' ? `<a class="btn sm" href="#/U03/${cur.id}">Umów sesję</a>` : ''}</div>
    <div class="msgs" id="thread">${th.length ? th.map(m => `<div class="bub ${m.from === 'me' ? 'me' : ''}">${esc(m.text)}<small>${m.time}</small></div>`).join('') : '<p class="mut" style="text-align:center">Napisz pierwszą wiadomość 👋</p>'}</div>
    <form data-form="msg" data-id="${cur.id}" class="field" style="padding:12px;margin:0;border-top:1px solid var(--line)" novalidate data-field="m"><div class="row"><input type="text" name="m" placeholder="Napisz wiadomość…" style="flex:1;width:auto" aria-label="Wiadomość"><button class="btn">Wyślij</button></div><div class="err" data-err="m" role="alert"></div></form></div></div>`;
    });
});
after['U10'] = () => { const t = $('#thread'); if (t)
    t.scrollTop = t.scrollHeight; };
forms['msg'] = f => {
    const v = val(f, 'm');
    const id = f.dataset.id;
    const errs = {};
    if (!v)
        errs.m = 'Wpisz treść wiadomości.';
    else if (v.length > 2000)
        errs.m = 'Maksymalnie 2000 znaków.';
    else if (/\d{9}|@\w+\.\w+|whatsapp|telegram/i.test(v))
        errs.m = 'Ze względów bezpieczeństwa nie udostępniaj danych kontaktowych – rozmawiaj na platformie.';
    if (!showErrors(f, errs))
        return;
    (S.convs[id] = S.convs[id] || []).push({ from: 'me', text: v, time: 'teraz' });
    const hash = location.hash;
    render();
    const t = $('#thread');
    if (t) {
        t.insertAdjacentHTML('beforeend', '<div class="bub"><small>pisze…</small>…</div>');
        t.scrollTop = t.scrollHeight;
    }
    setTimeout(() => { S.convs[id].push({ from: 'them', text: 'Dzięki za wiadomość! Odpiszę szczegółowo w ciągu kilku godzin. 🙂', time: 'teraz' }); if (location.hash === hash)
        render(); }, 1400);
};
/* ---------- U11 ---------- */
reg('U11', 'Ulubieni mentorzy', ['mentee'], () => {
    const list = MENTORS.filter(m => S.favorites.has(m.id));
    return `<h1>Ulubieni mentorzy</h1>` + withState({ empty: list.length === 0, emptyHtml: emptyBox('♡', 'Nie masz jeszcze ulubionych', 'Kliknij serce przy mentorze, aby zapisać go na później.', { label: 'Przeglądaj mentorów', href: '#/P02' }), skel: 'cards' }, () => `<div class="stack">${list.map(m => mentorCard(m)).join('')}</div>`);
});
/* ---------- U12 Płatności ---------- */
reg('U12', 'Płatności i pakiety', ['mentee'], () => {
    const t = S.tab.billing || 'cards';
    let body = '';
    if (t === 'cards')
        body = withState({ empty: S.cards.length === 0, emptyHtml: emptyBox('💳', 'Brak zapisanych kart', 'Dodaj kartę, aby szybciej rezerwować.', { label: 'Dodaj kartę', act: 'card-form' }) }, () => `<div class="stack">${S.cards.map(c => `<div class="card row between"><span>💳 <b>${c.brand} •••• ${c.last4}</b> <span class="mut">wygasa ${c.exp}</span> ${c.def ? badge('domyślna', 'p') : ''}</span><button class="btn sm sec" data-act="card-del" data-id="${c.id}">Usuń</button></div>`).join('')}<button class="btn" data-act="card-form">+ Dodaj kartę</button><div id="card-add"></div></div>`);
    else if (t === 'packages')
        body = withState({ emptyHtml: emptyBox('📦', 'Brak pakietów', 'Kup pakiet 5 lekcji i oszczędź 10%.', { label: 'Znajdź mentora', href: '#/P02' }) }, () => `<div class="card"><div class="row between"><div><b>Pakiet 5 lekcji – Anna Kowalska</b><br><span class="mut small">Ważny do 30.04.2027</span></div><div class="stat">3 / 5</div></div><a class="btn sm" href="#/U03/m1" style="margin-top:8px">Wykorzystaj lekcję</a></div>`);
    else
        body = withState({ emptyHtml: emptyBox('🧾', 'Brak faktur', 'Faktury pojawią się po pierwszej płatności.') }, () => `<div class="card pad0"><table><tr><th>Data</th><th>Opis</th><th>Kwota</th><th></th></tr>${S.bookings.filter(b => b.status !== 'cancelled').map(b => `<tr><td>${b.start.toLocaleDateString('pl-PL')}</td><td>${b.topic} – ${mentorById(b.mentorId).name}</td><td>${pln(b.price)}</td><td><button class="btn sm sec" data-act="toast" data-m="Pobrano fakturę PDF">PDF</button></td></tr>`).join('')}</table></div>`);
    return `<h1>Płatności i pakiety</h1>${tabsHtml('billing', [['cards', 'Metody płatności'], ['packages', 'Pakiety'], ['invoices', 'Faktury']], 'cards')}${body}`;
});
actions['card-form'] = () => {
    const box = $('#card-add');
    const html = `<form class="card" data-form="card-add" novalidate><h3>Nowa karta</h3><div data-formerr></div>${cardFields()}<div class="row"><button type="button" class="btn sec" data-act="tab" data-k="billing" data-v="cards">Anuluj</button><button class="btn">Zapisz kartę</button></div></form>`;
    if (box)
        box.innerHTML = html;
    else {
        S.cards = [];
        S.view = 'ok';
        render();
        $('#card-add')?.insertAdjacentHTML('beforeend', html);
    }
};
forms['card-add'] = f => {
    if (!showErrors(f, validateCard(f)))
        return;
    const n = val(f, 'cardnum').replace(/\s/g, '');
    S.cards.push({ id: 'c' + Date.now(), brand: n[0] === '5' ? 'Mastercard' : 'Visa', last4: n.slice(-4), exp: val(f, 'exp'), def: S.cards.length === 0 });
    toast('Karta zapisana');
    render();
};
actions['card-del'] = el => {
    if (S.bookings.some(b => b.status === 'upcoming' || b.status === 'pending') && S.cards.length === 1) {
        toast('Nie można usunąć karty powiązanej z przyszłą rezerwacją', 'err');
        return;
    }
    S.cards = S.cards.filter(c => c.id !== el.dataset.id);
    toast('Karta usunięta');
    render();
};
/* ---------- S01 Ustawienia ---------- */
reg('S01', 'Ustawienia konta', ['mentee', 'mentor', 'admin'], () => {
    const s = S.settings;
    const tog = (k, l, v) => `<label class="toggle"><span>${l}</span><input type="checkbox" ${v ? 'checked' : ''} data-input="notifset" data-k="${k}"></label>`;
    if (S.view === 'loading')
        return skeleton('detail');
    if (S.view === 'error')
        return errorBox();
    return `<h1>Ustawienia</h1><div class="grid g2" style="align-items:start"><form class="card" data-form="profile" novalidate><h2>Profil</h2><div data-formerr></div>${field('name', 'Imię i nazwisko', { value: s.name })}${field('email', 'E-mail', { type: 'email', value: s.email })}
   ${selectField('tz', 'Strefa czasowa', [['Europe/Warsaw', 'Europe/Warsaw (CET)'], ['Europe/London', 'Europe/London'], ['America/New_York', 'America/New_York']], s.tz)}${selectField('lang', 'Język interfejsu', [['pl', 'Polski'], ['en', 'English']], s.lang)}<button class="btn">Zapisz zmiany</button></form>
   <form class="card" data-form="password" novalidate><h2>Zmiana hasła</h2><div data-formerr></div>${field('cur', 'Aktualne hasło', { type: 'password' })}${field('pw', 'Nowe hasło', { type: 'password', hint: 'Min. 8 znaków, litera i cyfra' })}${field('pw2', 'Powtórz nowe hasło', { type: 'password' })}<button class="btn">Zmień hasło</button></form>
   <div class="card"><h2>Powiadomienia</h2>${tog('mail', 'E-mail', s.mail)}${tog('push', 'Push w przeglądarce', s.push)}${tog('reminders', 'Przypomnienia o sesjach (24 h i 1 h)', s.reminders)}${tog('marketing', 'Porady i oferty', s.marketing)}</div>
   <div class="card danger-zone"><h2>Prywatność i konto</h2><p class="mut">Pobierz kopię swoich danych lub usuń konto bezpowrotnie (RODO).</p><div class="row"><button class="btn sec" data-act="toast" data-m="Eksport danych zostanie wysłany e-mailem">Eksportuj dane</button><button class="btn danger" data-act="del-open">Usuń konto</button></div></div></div>`;
});
inputs['notifset'] = el => { S.settings[el.dataset.k] = el.checked; toast('Zapisano ustawienia powiadomień'); };
forms['profile'] = f => {
    const errs = {};
    const n = val(f, 'name');
    if (n.length < 2 || n.length > 60)
        errs.name = 'Imię i nazwisko: 2–60 znaków.';
    if (!isEmail(val(f, 'email')))
        errs.email = 'Podaj poprawny adres e-mail.';
    if (!showErrors(f, errs))
        return;
    Object.assign(S.settings, { name: n, email: val(f, 'email'), tz: val(f, 'tz'), lang: val(f, 'lang') });
    S.name = n;
    toast('Zapisano zmiany');
    renderNav();
};
forms['password'] = f => {
    const errs = {};
    const cur = val(f, 'cur'), pw = val(f, 'pw');
    if (!cur)
        errs.cur = 'Podaj aktualne hasło.';
    else if (cur === 'zlehaslo1')
        errs.cur = 'Aktualne hasło jest nieprawidłowe.';
    if (!strongPw(pw))
        errs.pw = 'Min. 8 znaków, co najmniej jedna litera i cyfra.';
    else if (pw === cur)
        errs.pw = 'Nowe hasło musi być inne niż obecne.';
    if (val(f, 'pw2') !== pw)
        errs.pw2 = 'Hasła nie są identyczne.';
    if (showErrors(f, errs)) {
        f.reset();
        toast('Hasło zostało zmienione');
    }
};
actions['del-open'] = () => modal(`<h2>Usunąć konto?</h2><div class="alert err">Tej operacji nie można cofnąć. Anulujemy przyszłe sesje.</div><form data-form="delete" novalidate>${field('confirm', 'Wpisz USUŃ, aby potwierdzić')}<div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn danger">Usuń konto</button></div></form>`);
forms['delete'] = f => { if (!showErrors(f, val(f, 'confirm') === 'USUŃ' ? {} : { confirm: 'Wpisz dokładnie: USUŃ' }))
    return; closeModal(); S.role = 'guest'; $('#dev-role').value = 'guest'; toast('Konto zostało usunięte'); go('#/P01'); };
/* ---------- S02 Powiadomienia ---------- */
reg('S02', 'Powiadomienia', ['mentee', 'mentor', 'admin'], () => `<div class="row between"><h1>Powiadomienia</h1><button class="btn sec sm" data-act="read-all">Oznacz wszystkie jako przeczytane</button></div>` +
    withState({ empty: S.notifs.length === 0, emptyHtml: emptyBox('🔔', 'Wszystko przeczytane', 'Nowe powiadomienia pojawią się tutaj.') }, () => `<div class="card pad0">${S.notifs.map(n => `<a href="${n.href}" data-act="read" data-id="${n.id}" class="row between" style="padding:14px 18px;border-bottom:1px solid var(--line);color:inherit;background:${n.read ? '#fff' : 'var(--pl)'}"><span>${n.read ? '' : '● '}${n.text}</span><span class="mut small">${n.time}</span></a>`).join('')}</div>`));
actions['read'] = el => { const n = S.notifs.find(x => x.id === el.dataset.id); if (n)
    n.read = true; renderNav(); };
actions['read-all'] = () => { S.notifs.forEach(n => n.read = true); toast('Oznaczono jako przeczytane'); renderNav(); render(); };

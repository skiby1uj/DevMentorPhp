function homeFor(role: Role) { return ({ guest: '#/P01', mentee: '#/U02', mentor: '#/M02', admin: '#/A01' })[role]; }
function loginAs(role: Role, name: string, email?: string) {
  S.role = role; S.name = name; if (email) S.settings.email = email; S.settings.name = name;
  ($('#dev-role') as HTMLSelectElement).value = role;
  const to = S.returnTo || homeFor(role); S.returnTo = '';
  toast(`Zalogowano jako ${name}`); go(to);
}

/* ---------- P01 ---------- */
reg('P01', 'Strona główna', [], () => {
  const featured = withState({ emptyHtml: '<p class="mut">Brak polecanych mentorów – skorzystaj z wyszukiwarki.</p>', skel: 'cards' },
    () => `<div class="grid g2">${MENTORS.slice(0, 4).map(m => mentorCard(m)).join('')}</div>`);
  return `<section class="hero"><h1>Naucz się od najlepszych – sesje 1:1 z mentorami</h1>
    <p>Kariera, programowanie, biznes. Pierwsza lekcja próbna od 25 zł.</p>
    <form class="sb" data-form="home-search" role="search"><input type="search" name="q" placeholder="Czego chcesz się nauczyć? np. product management" aria-label="Szukaj mentora"><button class="btn">Szukaj</button></form>
    <div class="chips" style="margin-top:16px">${TOPICS.slice(0, 5).map(t => `<button class="chip" data-act="topic-search" data-t="${t}">${t}</button>`).join('')}</div></section>
  <h2 style="margin-top:32px">Jak to działa</h2>
  <div class="grid g3">${[['1', 'Znajdź mentora', 'Filtruj po temacie, cenie i języku. Czytaj prawdziwe opinie.'], ['2', 'Umów lekcję próbną', 'Wybierz termin w swojej strefie czasowej i opłać bezpiecznie.'], ['3', 'Ucz się online', 'Dołącz do sali wideo, rób notatki i wracaj, gdy chcesz.']].map(s => `<div class="card"><span class="badge p">Krok ${s[0]}</span><h3 style="margin-top:8px">${s[1]}</h3><p class="mut">${s[2]}</p></div>`).join('')}</div>
  <h2 style="margin-top:32px">Polecani mentorzy</h2>${featured}
  <h2 style="margin-top:32px">Co mówią uczniowie</h2>
  <div class="grid g3">${REVIEWS.slice(0, 3).map(r => `<div class="card">${stars(r.rating)}<p>„${esc(r.text)}”</p><p class="mut small">${r.author}</p></div>`).join('')}</div>
  <div class="card row between" style="margin-top:32px;background:var(--pl)"><div><h2>Masz wiedzę, którą warto dzielić?</h2><p class="mut">Zostań mentorem, ustal własną cenę i dostępność.</p></div><a class="btn" href="#/P05?role=mentor" data-act="become-mentor">Zostań mentorem</a></div>`;
});
forms['home-search'] = f => { S.filters = { ...S.filters, q: val(f, 'q'), topic: '', shown: 6 }; go('#/P02'); };
actions['topic-search'] = el => { S.filters = { ...S.filters, q: '', topic: el.dataset.t!, shown: 6 }; go('#/P02'); };
actions['become-mentor'] = (_, e) => { e.preventDefault(); regRole = 'mentor'; go('#/P05'); };

/* ---------- P02 ---------- */
function filteredMentors(): Mentor[] {
  const f = S.filters; const q = f.q.toLowerCase();
  let r = MENTORS.filter(m => (!q || (m.name + m.headline + m.topics.join(' ')).toLowerCase().includes(q)) && (!f.topic || m.topics.includes(f.topic)) && m.price <= f.priceMax && (!f.lang || m.langs.includes(f.lang)) && m.rating >= f.ratingMin && (!f.soon || mentorSlots(m)[0].times.length > 0));
  const sorts: Record<string, (a: Mentor, b: Mentor) => number> = { rec: (a, b) => b.rating * Math.log(b.reviews + 2) - a.rating * Math.log(a.reviews + 2), 'p-asc': (a, b) => a.price - b.price, 'p-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
  return r.sort(sorts[f.sort]);
}
function resultsHtml(): string {
  const list = filteredMentors();
  const clear = emptyBox('🔍', 'Brak mentorów dla tych filtrów', 'Zmień kryteria lub wyczyść filtry.', { label: 'Wyczyść filtry', act: 'clear-filters' });
  return withState({ empty: list.length === 0, emptyHtml: clear, skel: 'cards' }, () =>
    `<p class="mut" aria-live="polite">Znaleziono ${list.length} mentorów</p><div class="stack">${list.slice(0, S.filters.shown).map(m => mentorCard(m)).join('')}</div>
     ${list.length > S.filters.shown ? `<p style="text-align:center;margin-top:16px"><button class="btn sec" data-act="more">Pokaż więcej (${list.length - S.filters.shown})</button></p>` : ''}`);
}
reg('P02', 'Wyszukiwarka mentorów', [], () => {
  const f = S.filters;
  return `<h1>Znajdź mentora</h1><div class="cols"><aside class="card sticky"><h3>Filtry</h3>
   <div class="field"><label for="q">Szukaj</label><input id="q" type="search" value="${esc(f.q)}" data-input="flt" data-k="q" placeholder="temat, imię…" maxlength="100"></div>
   <div class="field"><label for="t">Temat</label><select id="t" data-input="flt" data-k="topic"><option value="">Wszystkie</option>${TOPICS.map(t => `<option ${f.topic === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
   <div class="field"><label for="pm">Maks. cena: <b id="pmv">${f.priceMax} zł</b></label><input id="pm" type="range" min="0" max="300" step="10" value="${f.priceMax}" data-input="flt" data-k="priceMax" style="width:100%"></div>
   <div class="field"><label for="l">Język</label><select id="l" data-input="flt" data-k="lang"><option value="">Dowolny</option>${LANGS.map(t => `<option ${f.lang === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
   <div class="field"><label for="r">Minimalna ocena</label><select id="r" data-input="flt" data-k="ratingMin">${[0, 4, 4.5, 4.8].map(n => `<option value="${n}" ${f.ratingMin === n ? 'selected' : ''}>${n ? n + '+' : 'Dowolna'}</option>`).join('')}</select></div>
   <label class="row"><input type="checkbox" ${f.soon ? 'checked' : ''} data-input="flt" data-k="soon"> Dostępny jutro</label>
   <div class="divider"></div><button class="btn sec block" data-act="clear-filters">Wyczyść filtry</button></aside>
   <section><div class="row between" style="margin-bottom:12px"><span></span><label class="row">Sortuj <select data-input="flt" data-k="sort" style="width:auto"><option value="rec">Polecani</option><option value="p-asc" ${f.sort === 'p-asc' ? 'selected' : ''}>Cena rosnąco</option><option value="p-desc" ${f.sort === 'p-desc' ? 'selected' : ''}>Cena malejąco</option><option value="rating" ${f.sort === 'rating' ? 'selected' : ''}>Najwyżej oceniani</option></select></label></div>
   <div id="results">${resultsHtml()}</div></section></div>`;
});
inputs['flt'] = el => {
  const k = el.dataset.k as string; const f = S.filters as any;
  f[k] = el.type === 'checkbox' ? (el as HTMLInputElement).checked : (k === 'priceMax' || k === 'ratingMin') ? Number(el.value) : el.value;
  f.shown = 6; if (k === 'priceMax') $('#pmv')!.textContent = f.priceMax + ' zł';
  $('#results')!.innerHTML = resultsHtml();
};
actions['clear-filters'] = () => { S.filters = { q: '', topic: '', priceMax: 300, lang: '', ratingMin: 0, soon: false, sort: 'rec', shown: 6 }; S.view = 'ok'; render(); };
actions['more'] = () => { S.filters.shown += 6; $('#results')!.innerHTML = resultsHtml(); };
actions['fav'] = el => {
  if (S.role !== 'mentee') { S.returnTo = location.hash; toast('Zaloguj się jako uczeń, aby dodać do ulubionych', ''); go('#/P04'); return; }
  const id = el.dataset.id!; if (S.favorites.has(id)) { S.favorites.delete(id); toast('Usunięto z ulubionych'); } else { S.favorites.add(id); toast('Dodano do ulubionych'); }
  render();
};

/* ---------- P03 ---------- */
reg('P03', 'Profil mentora', [], id => {
  const m = MENTORS.find(x => x.id === id);
  if (S.view === 'loading') return skeleton('detail');
  if (S.view === 'error') return errorBox();
  if (!m) return emptyBox('🕳️', 'Mentor niedostępny', 'Profil nie istnieje lub został wyłączony (404).', { label: 'Wróć do wyszukiwarki', href: '#/P02' });
  const revs = REVIEWS.filter(r => r.mentorId === m.id);
  const fav = S.favorites.has(m.id);
  const dist = [5, 4, 3, 2, 1].map(n => Math.round(n === 5 ? m.rating * 18 - 70 : n === 4 ? 100 - (m.rating * 18 - 70) - 3 : 3 / n));
  const slots = mentorSlots(m).slice(0, 3);
  return `<div class="bc"><a href="#/P02">Mentorzy</a> › ${m.name}</div><div class="cols-r"><div class="stack">
   <div class="card mc">${avatar(m, 96)}<div class="body"><h1>${m.name} ${m.verified ? badge('✓ zweryfikowany', 'ok') : ''}</h1><p>${m.headline}</p><p class="mut small">📍 ${m.country} · 🗣 ${m.langs.join(', ')}</p>
     <p>${stars(m.rating)} <b>${m.rating.toFixed(1)}</b> (${m.reviews} opinii) · ${m.students} uczniów · ${m.lessons} lekcji</p></div></div>
   <div class="card"><h2>O mnie</h2><p>${m.bio}</p><div>${m.topics.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>
   <div class="card"><h2>Doświadczenie</h2><ul>${m.experience.map(e => `<li>${e}</li>`).join('')}</ul></div>
   <div class="card"><h2>Opinie (${m.reviews})</h2>
    ${S.view === 'empty' || revs.length === 0 ? emptyBox('💬', 'Brak opinii', 'Ten mentor nie ma jeszcze opinii – lekcja próbna to dobry początek.') :
      `<div style="max-width:320px;margin-bottom:12px">${[5, 4, 3, 2, 1].map((n, i) => `<div class="rate-bar">${n}★<i><b style="width:${Math.max(2, dist[i])}%"></b></i>${Math.max(2, dist[i])}%</div>`).join('')}</div>` +
      revs.map(r => `<div class="divider"></div>${stars(r.rating)} <b>${r.author}</b> <span class="mut small">${r.date}</span><p>${esc(r.text)}</p>`).join('')}</div></div>
   <aside class="card sticky"><div class="price">${m.price} zł <span class="mut small">/ 60 min</span></div>
    <p class="mut small">Lekcja próbna 30 min: <b>${m.trial} zł</b></p>
    <a class="btn block" href="#/U03/${m.id}">Umów lekcję próbną</a>
    <p></p><a class="btn sec block" href="#/U10/${m.id}">Napisz wiadomość</a>
    <p></p><button class="btn ghost block" data-act="fav" data-id="${m.id}">${fav ? '♥ W ulubionych' : '♡ Dodaj do ulubionych'}</button>
    <div class="divider"></div><h3>Najbliższe terminy</h3>
    ${slots.map(s => `<div class="small">${fmtDay(s.day)}: ${s.times.length ? s.times.join(', ') : '<span class="mut">brak</span>'}</div>`).join('')}
    <p class="hint">Czas w Twojej strefie: Europe/Warsaw</p>
    ${m.manual ? `<div class="alert info small">Ten mentor ręcznie akceptuje prośby (odpowiedź do 24 h).</div>` : ''}
    <div class="divider"></div><button class="btn ghost sm" data-act="report-open" data-id="${m.id}">🚩 Zgłoś profil</button></aside></div>`;
});
actions['report-open'] = el => {
  modal(`<h2>Zgłoś profil</h2><form data-form="report" data-id="${el.dataset.id}" novalidate><div data-formerr></div>
   ${selectField('reason', 'Powód', [['', 'Wybierz…'], ['fake', 'Fałszywe informacje'], ['abuse', 'Niewłaściwe zachowanie'], ['offplatform', 'Kontakt poza platformą']])}
   ${field('text', 'Opis (opcjonalnie)', { area: true, max: 500, hint: 'Maks. 500 znaków' })}
   <div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn">Wyślij zgłoszenie</button></div></form>`);
};
forms['report'] = f => {
  const errs: Record<string, string> = {}; if (!val(f, 'reason')) errs.reason = 'Wybierz powód zgłoszenia.'; if (val(f, 'text').length > 500) errs.text = 'Maksymalnie 500 znaków.';
  if (!showErrors(f, errs)) return; closeModal(); toast('Zgłoszenie wysłane do moderacji');
};

/* ---------- P04 ---------- */
reg('P04', 'Logowanie', [], () => `<div class="card" style="max-width:440px;margin:20px auto">
  <h1>Zaloguj się</h1>${S.returnTo ? '<div class="alert info">Zaloguj się, aby kontynuować.</div>' : ''}
  <form data-form="login" novalidate><div data-formerr></div>
   ${field('email', 'E-mail', { type: 'email', ph: 'np. kasia@example.com' })}${field('password', 'Hasło', { type: 'password' })}
   <div class="row between"><label class="row small"><input type="checkbox" data-act="toggle-pw"> Pokaż hasło</label><a href="#/P06" class="small">Nie pamiętam hasła</a></div>
   <p></p><button class="btn block">Zaloguj się</button></form>
  <div class="divider"></div><button class="btn sec block" data-act="toast" data-m="Logowanie przez Google – poza zakresem mockupu">Kontynuuj z Google</button>
  <p class="small" style="margin-top:14px">Nie masz konta? <a href="#/P05">Zarejestruj się</a></p>
  <div class="alert info small" style="margin-top:14px"><b>Demo:</b> e-mail zawierający „mentor” loguje jako mentora, „admin” – jako admina, inny – jako ucznia. Hasło min. 8 zn.; „blocked@example.com” = konto zablokowane.<div class="row" style="margin-top:8px"><button class="btn sm sec" data-act="quick" data-role="mentee">Uczeń</button><button class="btn sm sec" data-act="quick" data-role="mentor">Mentor</button><button class="btn sm sec" data-act="quick" data-role="admin">Admin</button></div></div></div>`);
actions['toggle-pw'] = el => { document.querySelectorAll<HTMLInputElement>('input[name=password]').forEach(i => i.type = (el as HTMLInputElement).checked ? 'text' : 'password'); };
actions['toast'] = el => toast(el.dataset.m!, '');
actions['quick'] = el => { const r = el.dataset.role as Role; loginAs(r, ({ mentee: 'Kasia Wiśniewska', mentor: 'Marta Zielińska', admin: 'Ola Moderator', guest: '' })[r]); };
forms['login'] = f => {
  const email = val(f, 'email'), pw = val(f, 'password'); const errs: Record<string, string> = {};
  if (!isEmail(email)) errs.email = 'Podaj poprawny adres e-mail.'; if (!pw) errs.password = 'Hasło jest wymagane.';
  if (!showErrors(f, errs)) return; const btn = f.querySelector('button.btn') as HTMLElement; setBusy(btn, true, 'Logowanie…');
  setTimeout(() => {
    setBusy(btn, false);
    if (email === 'blocked@example.com') return void showErrors(f, { form: 'To konto zostało zablokowane. Skontaktuj się z pomocą techniczną.' });
    if (pw.length < 8) return void showErrors(f, { form: 'Nieprawidłowy e-mail lub hasło.' });
    const role: Role = email.includes('admin') ? 'admin' : email.includes('mentor') ? 'mentor' : 'mentee';
    loginAs(role, role === 'mentee' ? S.settings.name || 'Kasia Wiśniewska' : role === 'mentor' ? 'Marta Zielińska' : 'Ola Moderator', email);
  }, 700);
};

/* ---------- P05 ---------- */
let regRole: 'mentee' | 'mentor' = 'mentee';
reg('P05', 'Rejestracja', [], () => `<div class="card" style="max-width:480px;margin:20px auto"><h1>Załóż konto</h1>
  <div class="tabs" role="tablist"><button class="tab ${regRole === 'mentee' ? 'on' : ''}" data-act="reg-role" data-r="mentee">Chcę się uczyć</button><button class="tab ${regRole === 'mentor' ? 'on' : ''}" data-act="reg-role" data-r="mentor">Chcę mentorować</button></div>
  <form data-form="register" novalidate><div data-formerr></div>
   ${field('name', 'Imię i nazwisko')}${field('email', 'E-mail', { type: 'email' })}
   ${field('password', 'Hasło', { type: 'password', hint: 'Min. 8 znaków, litera i cyfra' })}<div class="hint" id="pwm" style="margin:-8px 0 12px"></div>
   <div class="field" data-field="terms"><label class="row" style="font-weight:400"><input type="checkbox" name="terms"> Akceptuję <a href="#/P05">regulamin</a> i politykę prywatności</label><div class="err" data-err="terms" role="alert"></div></div>
   <label class="row small" style="margin-bottom:14px"><input type="checkbox" name="mkt"> Chcę otrzymywać porady i oferty (opcjonalnie)</label>
   <button class="btn block">Utwórz konto</button></form>
  <p class="small" style="margin-top:14px">Masz już konto? <a href="#/P04">Zaloguj się</a></p></div>`);
actions['reg-role'] = el => { regRole = el.dataset.r as any; render(); };
inputs['pw'] = el => { const v = el.value; const n = [v.length >= 8, /[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length; $('#pwm')!.textContent = v ? 'Siła hasła: ' + ['słabe', 'słabe', 'średnie', 'dobre', 'silne'][n] : ''; };
forms['register'] = f => {
  const errs: Record<string, string> = {}; const name = val(f, 'name'), email = val(f, 'email'), pw = val(f, 'password');
  if (name.length < 2 || name.length > 60) errs.name = 'Imię i nazwisko: 2–60 znaków.';
  if (!isEmail(email)) errs.email = 'Podaj poprawny adres e-mail.'; else if (email === 'zajety@example.com') errs.email = 'Ten e-mail jest już zarejestrowany.';
  if (!strongPw(pw)) errs.password = 'Hasło: min. 8 znaków, co najmniej jedna litera i cyfra.';
  if (!(f.elements.namedItem('terms') as HTMLInputElement).checked) errs.terms = 'Akceptacja regulaminu jest wymagana.';
  if (!showErrors(f, errs)) return; const btn = f.querySelector('button.btn') as HTMLElement; setBusy(btn, true, 'Tworzenie konta…');
  setTimeout(() => { S.settings.name = name; S.settings.email = email; if (regRole === 'mentor') { S.wiz.name = name; S.role = 'mentor'; S.name = name; ($('#dev-role') as HTMLSelectElement).value = 'mentor'; toast('Konto utworzone – uzupełnij profil mentora'); go('#/M01'); } else { S.role = 'mentee'; S.name = name; ($('#dev-role') as HTMLSelectElement).value = 'mentee'; S.prefs.step = 1; toast('Konto utworzone. Wysłaliśmy e-mail weryfikacyjny.'); go('#/U01'); } }, 800);
};

/* ---------- P06 ---------- */
reg('P06', 'Reset hasła', [], () => `<div class="card" style="max-width:440px;margin:20px auto"><h1>Reset hasła</h1><div id="reset-body"><p class="mut">Podaj e-mail powiązany z kontem – wyślemy link do ustawienia nowego hasła.</p>
  <form data-form="reset" novalidate><div data-formerr></div>${field('email', 'E-mail', { type: 'email' })}<button class="btn block">Wyślij link</button></form></div><p class="small" style="margin-top:14px"><a href="#/P04">← Wróć do logowania</a></p></div>`);
forms['reset'] = f => {
  const email = val(f, 'email'); if (!showErrors(f, isEmail(email) ? {} : { email: 'Podaj poprawny adres e-mail.' })) return;
  const btn = f.querySelector('button.btn') as HTMLElement; setBusy(btn, true, 'Wysyłanie…');
  setTimeout(() => { $('#reset-body')!.innerHTML = `<div class="alert ok">Jeśli konto istnieje, wysłaliśmy link do resetu hasła na adres <b>${esc(email)}</b>. Link jest ważny 1 godzinę.</div>`; }, 700);
};

"use strict";
// ---- data.ts ----
const TOPICS = ['Rozwój kariery', 'Programowanie', 'Product management', 'Biznes i startupy', 'Data science', 'Angielski biznesowy', 'Design / UX', 'Przywództwo'];
const LANGS = ['Polski', 'Angielski', 'Niemiecki'];
const MENTORS = [
    { id: 'm1', name: 'Anna Kowalska', initials: 'AK', color: '#4f46e5', headline: 'Senior Product Manager – pomagam wejść w PM', topics: ['Product management', 'Rozwój kariery'], langs: ['Polski', 'Angielski'], country: 'Polska', price: 120, trial: 40, rating: 4.9, reviews: 132, students: 48, lessons: 410, verified: true, manual: false, seed: 1,
        bio: 'Od 9 lat buduję produkty cyfrowe w e-commerce i fintechu. Pomagam osobom z innych branż przejść do product managementu: CV, rozmowy rekrutacyjne, case studies, pierwsze 90 dni w roli.', experience: ['Senior PM – duża platforma e-commerce (2020–dziś)', 'PM – fintech (2016–2020)', 'Analityk biznesowy (2014–2016)'] },
    { id: 'm2', name: 'Piotr Nowak', initials: 'PN', color: '#0891b2', headline: 'Staff Engineer – TypeScript, architektura, code review', topics: ['Programowanie'], langs: ['Polski', 'Angielski'], country: 'Polska', price: 150, trial: 50, rating: 4.8, reviews: 87, students: 31, lessons: 260, verified: true, manual: false, seed: 2,
        bio: 'Programuję od 12 lat, ostatnio w zespołach platformowych. Pomagam rozwijać się z poziomu mid do senior: projektowanie systemów, jakość kodu, przygotowanie do rozmów technicznych.', experience: ['Staff Engineer (2021–dziś)', 'Tech Lead (2018–2021)', 'Backend Developer (2013–2018)'] },
    { id: 'm3', name: 'Marta Zielińska', initials: 'MZ', color: '#db2777', headline: 'Engineering Manager – przywództwo i komunikacja', topics: ['Przywództwo', 'Rozwój kariery'], langs: ['Polski', 'Angielski', 'Niemiecki'], country: 'Niemcy', price: 180, trial: 60, rating: 5.0, reviews: 41, students: 19, lessons: 120, verified: true, manual: true, seed: 3,
        bio: 'Prowadzę zespoły inżynierskie od 7 lat. Mentoruję nowych liderów: 1:1, feedback, delegowanie, zarządzanie konfliktami i oczekiwaniami interesariuszy.', experience: ['Engineering Manager (2019–dziś)', 'Team Lead (2015–2019)'] },
    { id: 'm4', name: 'Jan Wiśniewski', initials: 'JW', color: '#16a34a', headline: 'Founder – od pomysłu do pierwszych klientów', topics: ['Biznes i startupy'], langs: ['Polski'], country: 'Polska', price: 90, trial: 30, rating: 4.6, reviews: 23, students: 14, lessons: 64, verified: true, manual: false, seed: 4,
        bio: 'Założyciel dwóch startupów SaaS (jeden exit). Pomagam walidować pomysły, budować MVP i przygotowywać pitch dla inwestorów.', experience: ['Founder & CEO SaaS (2017–2022)', 'Business Developer (2014–2017)'] },
    { id: 'm5', name: 'Sara Lewandowska', initials: 'SL', color: '#ea580c', headline: 'Data Scientist – od SQL do modeli ML', topics: ['Data science', 'Programowanie'], langs: ['Polski', 'Angielski'], country: 'Polska', price: 110, trial: 35, rating: 4.7, reviews: 56, students: 27, lessons: 180, verified: true, manual: false, seed: 5,
        bio: 'Pracuję z danymi w bankowości i medtechu. Uczę praktycznie: analiza danych, Python, statystyka, projekty do portfolio.', experience: ['Senior Data Scientist (2020–dziś)', 'Data Analyst (2016–2020)'] },
    { id: 'm6', name: 'Tom Becker', initials: 'TB', color: '#7c3aed', headline: 'Business English coach – prezentacje i negocjacje', topics: ['Angielski biznesowy'], langs: ['Angielski', 'Niemiecki'], country: 'Niemcy', price: 100, trial: 25, rating: 4.9, reviews: 204, students: 72, lessons: 890, verified: true, manual: false, seed: 6,
        bio: 'Native speaker z 10-letnim doświadczeniem w korporacjach. Ćwiczymy realne sytuacje: spotkania, e-maile, negocjacje, small talk.', experience: ['Business English Trainer (2014–dziś)'] },
    { id: 'm7', name: 'Ewa Mazur', initials: 'EM', color: '#0d9488', headline: 'Lead UX Designer – portfolio i research', topics: ['Design / UX', 'Rozwój kariery'], langs: ['Polski', 'Angielski'], country: 'Polska', price: 100, trial: 35, rating: 4.5, reviews: 18, students: 11, lessons: 52, verified: true, manual: false, seed: 7,
        bio: 'Projektuję produkty cyfrowe od 8 lat. Pomagam zbudować portfolio, przygotować się do rekrutacji i prowadzić badania z użytkownikami.', experience: ['Lead UX Designer (2021–dziś)', 'UX Designer (2016–2021)'] },
    { id: 'm8', name: 'Kamil Dąbrowski', initials: 'KD', color: '#ca8a04', headline: 'CTO – skalowanie zespołów i architektury', topics: ['Przywództwo', 'Programowanie', 'Biznes i startupy'], langs: ['Polski', 'Angielski'], country: 'Polska', price: 200, trial: 70, rating: 4.8, reviews: 35, students: 16, lessons: 98, verified: true, manual: true, seed: 8,
        bio: 'CTO w scale-upie (150 osób). Mentoruję CTO i liderów technicznych: strategia techniczna, rekrutacja, kultura inżynierska.', experience: ['CTO (2019–dziś)', 'VP Engineering (2016–2019)'] },
];
const REVIEWS = [
    { mentorId: 'm1', author: 'Kasia W.', rating: 5, text: 'Świetna sesja – konkretny plan przejścia do PM i feedback do CV. Polecam!', date: '2 tyg. temu' },
    { mentorId: 'm1', author: 'Michał T.', rating: 5, text: 'Anna świetnie przygotowała mnie do rozmowy rekrutacyjnej. Dostałem ofertę.', date: '1 mies. temu' },
    { mentorId: 'm1', author: 'Ola S.', rating: 4, text: 'Bardzo merytorycznie, trochę zabrakło czasu na pytania.', date: '2 mies. temu' },
    { mentorId: 'm2', author: 'Bartek R.', rating: 5, text: 'Code review na żywo to coś, czego mi brakowało. Dużo praktyki.', date: '3 tyg. temu' },
    { mentorId: 'm2', author: 'Iga P.', rating: 5, text: 'Pomógł mi poukładać wiedzę o architekturze.', date: '2 mies. temu' },
    { mentorId: 'm3', author: 'Paweł D.', rating: 5, text: 'Po 3 sesjach czuję się pewniej jako nowy lider.', date: '1 tyg. temu' },
    { mentorId: 'm6', author: 'Natalia K.', rating: 5, text: 'Prezentacje po angielsku przestały mnie stresować.', date: '5 dni temu' },
];
const SLOT_TIMES = [['17:00', '18:00', '19:30'], ['09:00', '12:00', '18:00', '20:00'], ['16:00', '17:30', '19:00'], ['08:00', '13:00', '21:00']];
function addDays(n, h = 0, m = 0) { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(h, m, 0, 0); return d; }
function mentorSlots(m) {
    const out = [];
    for (let i = 1; i <= 7; i++) {
        const base = SLOT_TIMES[(m.seed + i) % SLOT_TIMES.length];
        out.push({ day: addDays(i), times: (m.seed + i) % 5 === 0 ? [] : base });
    }
    return out;
}
const fmtDay = (d) => d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' });
const fmtDT = (d) => d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'long' }) + ', ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
const pln = (n) => n.toFixed(2).replace('.', ',') + ' zł';
const S = {
    role: 'guest', name: 'Kasia Wiśniewska', view: 'ok', returnTo: '',
    favorites: new Set(['m1', 'm6']),
    filters: { q: '', topic: '', priceMax: 300, lang: '', ratingMin: 0, soon: false, sort: 'rec', shown: 6 },
    bookings: [
        { id: 'b1', mentorId: 'm1', start: addDays(1, 18, 0), durationMin: 60, topic: 'Przejście do PM', status: 'upcoming', price: 120, reviewed: false },
        { id: 'b2', mentorId: 'm2', start: addDays(-6, 19, 0), durationMin: 60, topic: 'Code review', status: 'done', price: 150, reviewed: false },
        { id: 'b3', mentorId: 'm6', start: addDays(-14, 17, 0), durationMin: 30, topic: 'Lekcja próbna', status: 'done', price: 25, reviewed: true },
        { id: 'b4', mentorId: 'm4', start: addDays(-3, 12, 0), durationMin: 60, topic: 'Walidacja pomysłu', status: 'cancelled', price: 90, reviewed: false },
    ],
    draft: null,
    convs: {
        m1: [{ from: 'them', text: 'Cześć! Cieszę się, że się umówiliśmy. Prześlij proszę swoje CV przed sesją.', time: 'wczoraj 20:14' }, { from: 'me', text: 'Dzień dobry, jasne – wyślę dziś wieczorem.', time: 'wczoraj 20:30' }],
        m2: [{ from: 'them', text: 'Dzięki za sesję! Podsyłam notatki z code review.', time: '6 dni temu' }],
    },
    prefs: { goal: '', level: 'mid', budget: 150, times: [], step: 1, done: false },
    wiz: { step: 1, name: 'Marta Zielińska', headline: '', bio: '', topics: [], price: '', langs: ['Polski'], doc: '', consent: false, status: 'draft' },
    requests: [
        { id: 'r1', student: 'Kasia Wiśniewska', initials: 'KW', color: '#4f46e5', start: addDays(2, 18, 0), topic: 'Lekcja próbna – przywództwo', message: 'Właśnie awansowałam na team leada, chciałabym porozmawiać o 1:1.', hoursLeft: 20 },
        { id: 'r2', student: 'Marek Lis', initials: 'ML', color: '#0891b2', start: addDays(3, 17, 30), topic: 'Feedback i delegowanie', message: '', hoursLeft: 5 },
    ],
    mentorUpcoming: [{ id: 'b1', student: 'Tomasz Gajda', start: addDays(1, 18, 0), topic: 'Rozmowy 1:1' }],
    avail: new Set(['0-18', '0-19', '2-18', '2-19', '4-17']), availSaved: true,
    students: [
        { name: 'Tomasz Gajda', initials: 'TG', color: '#0891b2', sessions: 6, last: '3 dni temu', note: 'Chce przejść na stanowisko EM do końca roku.' },
        { name: 'Joanna Rak', initials: 'JR', color: '#db2777', sessions: 3, last: '2 tyg. temu', note: '' },
        { name: 'Michał Orzeł', initials: 'MO', color: '#16a34a', sessions: 1, last: '1 mies. temu', note: '' },
    ],
    balance: { available: 540, pending: 360, paid: 2880 }, payoutIban: '',
    txs: [
        { date: '20.10', desc: 'Sesja – Tomasz Gajda', amount: 144, status: 'Oczekuje (T+7)' },
        { date: '15.10', desc: 'Sesja – Joanna Rak', amount: 144, status: 'Dostępne' },
        { date: '10.10', desc: 'Wypłata na konto', amount: -720, status: 'Wypłacono' },
        { date: '08.10', desc: 'Lekcja próbna – Michał Orzeł', amount: 48, status: 'Dostępne' },
    ],
    apps: [
        { id: 'a1', name: 'Dawid Krawczyk', headline: 'DevOps Lead – Kubernetes i CI/CD', topics: ['Programowanie'], docs: ['cv_dawid.pdf', 'certyfikat_cka.pdf'], submitted: 'dziś 09:12', status: 'pending', bio: 'Od 10 lat pracuję w DevOps. Pomagam wejść w świat chmury i kontenerów, przygotowuję do certyfikacji CKA.' },
        { id: 'a2', name: 'Natalia Brzoza', headline: 'Career coach', topics: ['Rozwój kariery'], docs: ['dyplom.jpg'], submitted: 'wczoraj', status: 'pending', bio: 'Pomagam w zmianie ścieżki zawodowej i przygotowaniu do rozmów.' },
        { id: 'a3', name: 'Oskar Lipiński', headline: 'Growth hacker', topics: ['Biznes i startupy'], docs: ['cv.pdf'], submitted: '3 dni temu', status: 'changes', comment: 'Prosimy o dodanie referencji.', bio: 'Marketing wzrostowy dla startupów.' },
    ],
    reports: [
        { id: 'rp1', severity: 'high', type: 'Niewłaściwe zachowanie', reporter: 'Kasia Wiśniewska', target: 'Mentor X (m9)', text: 'Mentor próbował przenieść rozmowę poza platformę i prosił o płatność na prywatne konto.', status: 'open' },
        { id: 'rp2', severity: 'med', type: 'No-show mentora', reporter: 'Marek Lis', target: 'Jan Wiśniewski', text: 'Mentor nie pojawił się na sesji, czekałem 15 minut.', status: 'open' },
        { id: 'rp3', severity: 'low', type: 'Błąd w profilu', reporter: 'Ola S.', target: 'Ewa Mazur', text: 'Literówka w opisie.', status: 'open' },
    ],
    users: [
        { id: 'u0', name: 'Ola Moderator', email: 'admin@mentorhub.pl', role: 'admin', status: 'active', joined: '2025-05-01' },
        { id: 'u1', name: 'Kasia Wiśniewska', email: 'kasia@example.com', role: 'mentee', status: 'active', joined: '2026-03-02' },
        { id: 'u2', name: 'Marta Zielińska', email: 'mentor.marta@example.com', role: 'mentor', status: 'active', joined: '2026-01-14' },
        { id: 'u3', name: 'Jan Wiśniewski', email: 'jan@example.com', role: 'mentor', status: 'active', joined: '2025-11-30' },
        { id: 'u4', name: 'Marek Lis', email: 'marek@example.com', role: 'mentee', status: 'active', joined: '2026-06-18' },
        { id: 'u5', name: 'Spam Bot', email: 'spam@example.net', role: 'mentee', status: 'suspended', joined: '2026-09-01' },
    ],
    notifs: [
        { id: 'n1', text: 'Sesja z Anną Kowalską jutro o 18:00.', time: '1 h temu', read: false, href: '#/U07/b1' },
        { id: 'n2', text: 'Nowa wiadomość od Piotra Nowaka.', time: 'wczoraj', read: false, href: '#/U10/m2' },
        { id: 'n3', text: 'Wystaw opinię o sesji z Piotrem Nowakiem.', time: '6 dni temu', read: true, href: '#/U09/b2' },
    ],
    cards: [{ id: 'c1', brand: 'Visa', last4: '4242', exp: '08/28', def: true }],
    tab: {},
    settings: { name: 'Kasia Wiśniewska', email: 'kasia@example.com', tz: 'Europe/Warsaw', lang: 'pl', mail: true, push: true, reminders: true, marketing: false },
    roomMic: true, roomCam: true, roomShare: false, roomStart: 0,
    userQ: '', userRole: '', studentQ: '', selApp: 'a1', selReport: 'rp1',
};
// ---- ui.ts ----
const SCREENS = {};
function reg(id, title, roles, render) { SCREENS[id] = { id, title, roles, render }; }
const actions = {};
const forms = {};
const inputs = {};
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const go = (hash) => { if (location.hash === hash)
    render();
else
    location.hash = hash; };
const mentorById = (id) => MENTORS.find(m => m.id === id);
function toast(msg, kind = 'ok') {
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 3200);
}
function modal(html) { $('#modal-root').innerHTML = `<div class="modal" role="dialog" aria-modal="true"><div class="box">${html}</div></div>`; }
function closeModal() { $('#modal-root').innerHTML = ''; }
function avatar(o, size = 48) {
    return `<span class="av" style="width:${size}px;height:${size}px;background:${o.color};font-size:${Math.round(size / 2.6)}px" aria-hidden="true">${o.initials}</span>`;
}
function stars(r) { const f = Math.round(r); return `<span class="stars" aria-label="Ocena ${r} na 5">${'★'.repeat(f)}${'☆'.repeat(5 - f)}</span>`; }
function badge(t, k = '') { return `<span class="badge ${k}">${t}</span>`; }
function spinBtn(label, cls = '', extra = '') { return `<button class="btn ${cls}" ${extra}>${label}</button>`; }
function field(name, label, o = {}) {
    const v = esc(o.value || '');
    const input = o.area
        ? `<textarea id="f-${name}" name="${name}" placeholder="${o.ph || ''}" ${o.max ? `maxlength="${o.max}"` : ''} aria-describedby="e-${name}">${v}</textarea>`
        : `<input id="f-${name}" name="${name}" type="${o.type || 'text'}" value="${v}" placeholder="${o.ph || ''}" autocomplete="off" aria-describedby="e-${name}">`;
    return `<div class="field" data-field="${name}"><label for="f-${name}">${label}</label>${input}${o.hint ? `<div class="hint">${o.hint}</div>` : ''}<div class="err" id="e-${name}" data-err="${name}" role="alert"></div></div>`;
}
function selectField(name, label, opts, val = '') {
    return `<div class="field" data-field="${name}"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}">${opts.map(o => `<option value="${o[0]}" ${o[0] === val ? 'selected' : ''}>${o[1]}</option>`).join('')}</select><div class="err" data-err="${name}" role="alert"></div></div>`;
}
/** Walidacja: rules zwraca mapę pole→komunikat; pokazuje błędy przy polach. Zwraca true gdy OK. */
function showErrors(f, errs) {
    f.querySelectorAll('[data-field]').forEach(w => { w.classList.remove('bad'); w.querySelector('[data-err]').textContent = ''; });
    let first = true;
    for (const k in errs) {
        const w = f.querySelector(`[data-field="${k}"]`);
        if (w) {
            w.classList.add('bad');
            w.querySelector('[data-err]').textContent = errs[k];
            if (first) {
                w.querySelector('input,textarea,select')?.focus();
                first = false;
            }
        }
        else {
            const g = f.querySelector('[data-formerr]');
            if (g) {
                g.className = 'alert err';
                g.textContent = errs[k];
            }
        }
    }
    return Object.keys(errs).length === 0;
}
const val = (f, n) => (f.elements.namedItem(n)?.value || '').trim();
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const strongPw = (s) => s.length >= 8 && /[A-Za-z]/.test(s) && /\d/.test(s);
function setBusy(btn, busy, label) {
    if (!btn)
        return;
    const b = btn;
    if (busy) {
        b.dataset.l = b.innerHTML;
        b.disabled = true;
        b.innerHTML = `<span class="spin"></span> ${label || 'Proszę czekać…'}`;
    }
    else {
        b.disabled = false;
        b.innerHTML = b.dataset.l || b.innerHTML;
    }
}
/* ---- Stany loading / empty / error / ok ---- */
function skeleton(kind = 'list') {
    const line = (w) => `<div class="skel" style="width:${w}%"></div>`;
    if (kind === 'cards')
        return `<div class="grid g2">${[1, 2, 3, 4].map(() => `<div class="card">${line(40)}${line(90)}${line(70)}</div>`).join('')}</div>`;
    if (kind === 'detail')
        return `<div class="card">${line(30)}${line(100)}${line(95)}${line(60)}<div class="skel" style="height:120px"></div></div>`;
    return `<div class="stack" aria-busy="true" aria-label="Wczytywanie">${[1, 2, 3].map(() => `<div class="card">${line(35)}${line(80)}</div>`).join('')}</div>`;
}
function emptyBox(icon, title, text, cta) {
    const btn = cta ? (cta.href ? `<a class="btn" href="${cta.href}">${cta.label}</a>` : `<button class="btn" data-act="${cta.act}">${cta.label}</button>`) : '';
    return `<div class="empty"><div class="ic">${icon}</div><h3>${title}</h3><p class="mut">${text}</p>${btn}</div>`;
}
function errorBox(text = 'Nie udało się wczytać danych. Sprawdź połączenie i spróbuj ponownie.') {
    return `<div class="errbox" role="alert"><div class="ic">⚠️</div><h3>Coś poszło nie tak</h3><p class="mut">${text}<br><span class="small">Kod: ERR_NETWORK (500)</span></p><button class="btn sec" data-act="retry">Spróbuj ponownie</button></div>`;
}
function withState(o, ok) {
    if (S.view === 'loading')
        return skeleton(o.skel);
    if (S.view === 'error')
        return errorBox(o.errText);
    if (S.view === 'empty' || o.empty)
        return o.emptyHtml;
    return ok();
}
function mentorCard(m, opts = {}) {
    const fav = S.favorites.has(m.id);
    return `<article class="card mc">${avatar(m, 64)}
  <div class="body">
    <div class="row between"><h3><a href="#/P03/${m.id}">${m.name}</a> ${m.verified ? badge('✓ zweryfikowany', 'ok') : ''}</h3>
      <button class="heart ${fav ? 'on' : ''}" data-act="fav" data-id="${m.id}" aria-pressed="${fav}" aria-label="${fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}">${fav ? '♥' : '♡'}</button></div>
    <p class="mut small">${m.headline}</p>
    <div>${m.topics.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    <div class="row between"><span>${stars(m.rating)} <b>${m.rating.toFixed(1)}</b> <span class="mut small">(${m.reviews})</span> · <span class="mut small">${m.langs.join(', ')}</span></span>
      <span><span class="price">${m.price} zł</span><span class="mut small">/h</span> <a class="btn sm" href="#/U03/${m.id}">Umów</a></span></div>
  </div></article>`;
}
function statusBadge(s) {
    return ({ upcoming: badge('Potwierdzona', 'ok'), pending: badge('Oczekuje na mentora', 'warn'), done: badge('Zakończona', ''), cancelled: badge('Anulowana', 'err') })[s];
}
function minutesTo(d) { return Math.round((d.getTime() - Date.now()) / 60000); }
const after = {};
function slotDate(slot) { const [d, t] = slot.split('|'); const [h, m] = t.split(':').map(Number); const x = new Date(d + 'T00:00:00'); x.setHours(h, m, 0, 0); return x; }
function slotKey(day, time) { const d = new Date(day); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}|${time}`; }
function luhn(num) { let s = 0, alt = false; for (let i = num.length - 1; i >= 0; i--) {
    let n = +num[i];
    if (alt) {
        n *= 2;
        if (n > 9)
            n -= 9;
    }
    s += n;
    alt = !alt;
} return s % 10 === 0; }
function validateCard(f) {
    const errs = {};
    const num = val(f, 'cardnum').replace(/\s/g, '');
    const exp = val(f, 'exp');
    const cvc = val(f, 'cvc');
    if (!/^\d{16}$/.test(num) || !luhn(num))
        errs.cardnum = 'Podaj poprawny 16-cyfrowy numer karty.';
    const m = /^(\d{2})\/(\d{2})$/.exec(exp);
    if (!m || +m[1] < 1 || +m[1] > 12)
        errs.exp = 'Format MM/RR.';
    else {
        const end = new Date(2000 + +m[2], +m[1], 1);
        if (end.getTime() < Date.now())
            errs.exp = 'Karta wygasła.';
    }
    if (!/^\d{3,4}$/.test(cvc))
        errs.cvc = 'CVC: 3–4 cyfry.';
    if (val(f, 'holder').length < 2)
        errs.holder = 'Podaj imię i nazwisko z karty.';
    return errs;
}
function cardFields() {
    return field('cardnum', 'Numer karty', { ph: '4242 4242 4242 4242', hint: 'Demo: 4242… = sukces, 4000 0000 0000 0002 = karta odrzucona' }) +
        `<div class="grid g2">${field('exp', 'Ważna do (MM/RR)', { ph: '08/28' })}${field('cvc', 'CVC', { ph: '123' })}</div>` + field('holder', 'Imię i nazwisko na karcie');
}
// ---- screens-public.ts ----
function homeFor(role) { return ({ guest: '#/P01', mentee: '#/U02', mentor: '#/M02', admin: '#/A01' })[role]; }
function loginAs(role, name, email) {
    S.role = role;
    S.name = name;
    if (email)
        S.settings.email = email;
    S.settings.name = name;
    $('#dev-role').value = role;
    const to = S.returnTo || homeFor(role);
    S.returnTo = '';
    toast(`Zalogowano jako ${name}`);
    go(to);
}
/* ---------- P01 ---------- */
reg('P01', 'Strona główna', [], () => {
    const featured = withState({ emptyHtml: '<p class="mut">Brak polecanych mentorów – skorzystaj z wyszukiwarki.</p>', skel: 'cards' }, () => `<div class="grid g2">${MENTORS.slice(0, 4).map(m => mentorCard(m)).join('')}</div>`);
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
actions['topic-search'] = el => { S.filters = { ...S.filters, q: '', topic: el.dataset.t, shown: 6 }; go('#/P02'); };
actions['become-mentor'] = (_, e) => { e.preventDefault(); regRole = 'mentor'; go('#/P05'); };
/* ---------- P02 ---------- */
function filteredMentors() {
    const f = S.filters;
    const q = f.q.toLowerCase();
    let r = MENTORS.filter(m => (!q || (m.name + m.headline + m.topics.join(' ')).toLowerCase().includes(q)) && (!f.topic || m.topics.includes(f.topic)) && m.price <= f.priceMax && (!f.lang || m.langs.includes(f.lang)) && m.rating >= f.ratingMin && (!f.soon || mentorSlots(m)[0].times.length > 0));
    const sorts = { rec: (a, b) => b.rating * Math.log(b.reviews + 2) - a.rating * Math.log(a.reviews + 2), 'p-asc': (a, b) => a.price - b.price, 'p-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
    return r.sort(sorts[f.sort]);
}
function resultsHtml() {
    const list = filteredMentors();
    const clear = emptyBox('🔍', 'Brak mentorów dla tych filtrów', 'Zmień kryteria lub wyczyść filtry.', { label: 'Wyczyść filtry', act: 'clear-filters' });
    return withState({ empty: list.length === 0, emptyHtml: clear, skel: 'cards' }, () => `<p class="mut" aria-live="polite">Znaleziono ${list.length} mentorów</p><div class="stack">${list.slice(0, S.filters.shown).map(m => mentorCard(m)).join('')}</div>
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
    const k = el.dataset.k;
    const f = S.filters;
    f[k] = el.type === 'checkbox' ? el.checked : (k === 'priceMax' || k === 'ratingMin') ? Number(el.value) : el.value;
    f.shown = 6;
    if (k === 'priceMax')
        $('#pmv').textContent = f.priceMax + ' zł';
    $('#results').innerHTML = resultsHtml();
};
actions['clear-filters'] = () => { S.filters = { q: '', topic: '', priceMax: 300, lang: '', ratingMin: 0, soon: false, sort: 'rec', shown: 6 }; S.view = 'ok'; render(); };
actions['more'] = () => { S.filters.shown += 6; $('#results').innerHTML = resultsHtml(); };
actions['fav'] = el => {
    if (S.role !== 'mentee') {
        S.returnTo = location.hash;
        toast('Zaloguj się jako uczeń, aby dodać do ulubionych', '');
        go('#/P04');
        return;
    }
    const id = el.dataset.id;
    if (S.favorites.has(id)) {
        S.favorites.delete(id);
        toast('Usunięto z ulubionych');
    }
    else {
        S.favorites.add(id);
        toast('Dodano do ulubionych');
    }
    render();
};
/* ---------- P03 ---------- */
reg('P03', 'Profil mentora', [], id => {
    const m = MENTORS.find(x => x.id === id);
    if (S.view === 'loading')
        return skeleton('detail');
    if (S.view === 'error')
        return errorBox();
    if (!m)
        return emptyBox('🕳️', 'Mentor niedostępny', 'Profil nie istnieje lub został wyłączony (404).', { label: 'Wróć do wyszukiwarki', href: '#/P02' });
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
    const errs = {};
    if (!val(f, 'reason'))
        errs.reason = 'Wybierz powód zgłoszenia.';
    if (val(f, 'text').length > 500)
        errs.text = 'Maksymalnie 500 znaków.';
    if (!showErrors(f, errs))
        return;
    closeModal();
    toast('Zgłoszenie wysłane do moderacji');
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
actions['toggle-pw'] = el => { document.querySelectorAll('input[name=password]').forEach(i => i.type = el.checked ? 'text' : 'password'); };
actions['toast'] = el => toast(el.dataset.m, '');
actions['quick'] = el => { const r = el.dataset.role; loginAs(r, ({ mentee: 'Kasia Wiśniewska', mentor: 'Marta Zielińska', admin: 'Ola Moderator', guest: '' })[r]); };
forms['login'] = f => {
    const email = val(f, 'email'), pw = val(f, 'password');
    const errs = {};
    if (!isEmail(email))
        errs.email = 'Podaj poprawny adres e-mail.';
    if (!pw)
        errs.password = 'Hasło jest wymagane.';
    if (!showErrors(f, errs))
        return;
    const btn = f.querySelector('button.btn');
    setBusy(btn, true, 'Logowanie…');
    setTimeout(() => {
        setBusy(btn, false);
        if (email === 'blocked@example.com')
            return void showErrors(f, { form: 'To konto zostało zablokowane. Skontaktuj się z pomocą techniczną.' });
        if (pw.length < 8)
            return void showErrors(f, { form: 'Nieprawidłowy e-mail lub hasło.' });
        const role = email.includes('admin') ? 'admin' : email.includes('mentor') ? 'mentor' : 'mentee';
        loginAs(role, role === 'mentee' ? S.settings.name || 'Kasia Wiśniewska' : role === 'mentor' ? 'Marta Zielińska' : 'Ola Moderator', email);
    }, 700);
};
/* ---------- P05 ---------- */
let regRole = 'mentee';
reg('P05', 'Rejestracja', [], () => `<div class="card" style="max-width:480px;margin:20px auto"><h1>Załóż konto</h1>
  <div class="tabs" role="tablist"><button class="tab ${regRole === 'mentee' ? 'on' : ''}" data-act="reg-role" data-r="mentee">Chcę się uczyć</button><button class="tab ${regRole === 'mentor' ? 'on' : ''}" data-act="reg-role" data-r="mentor">Chcę mentorować</button></div>
  <form data-form="register" novalidate><div data-formerr></div>
   ${field('name', 'Imię i nazwisko')}${field('email', 'E-mail', { type: 'email' })}
   ${field('password', 'Hasło', { type: 'password', hint: 'Min. 8 znaków, litera i cyfra' })}<div class="hint" id="pwm" style="margin:-8px 0 12px"></div>
   <div class="field" data-field="terms"><label class="row" style="font-weight:400"><input type="checkbox" name="terms"> Akceptuję <a href="#/P05">regulamin</a> i politykę prywatności</label><div class="err" data-err="terms" role="alert"></div></div>
   <label class="row small" style="margin-bottom:14px"><input type="checkbox" name="mkt"> Chcę otrzymywać porady i oferty (opcjonalnie)</label>
   <button class="btn block">Utwórz konto</button></form>
  <p class="small" style="margin-top:14px">Masz już konto? <a href="#/P04">Zaloguj się</a></p></div>`);
actions['reg-role'] = el => { regRole = el.dataset.r; render(); };
inputs['pw'] = el => { const v = el.value; const n = [v.length >= 8, /[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length; $('#pwm').textContent = v ? 'Siła hasła: ' + ['słabe', 'słabe', 'średnie', 'dobre', 'silne'][n] : ''; };
forms['register'] = f => {
    const errs = {};
    const name = val(f, 'name'), email = val(f, 'email'), pw = val(f, 'password');
    if (name.length < 2 || name.length > 60)
        errs.name = 'Imię i nazwisko: 2–60 znaków.';
    if (!isEmail(email))
        errs.email = 'Podaj poprawny adres e-mail.';
    else if (email === 'zajety@example.com')
        errs.email = 'Ten e-mail jest już zarejestrowany.';
    if (!strongPw(pw))
        errs.password = 'Hasło: min. 8 znaków, co najmniej jedna litera i cyfra.';
    if (!f.elements.namedItem('terms').checked)
        errs.terms = 'Akceptacja regulaminu jest wymagana.';
    if (!showErrors(f, errs))
        return;
    const btn = f.querySelector('button.btn');
    setBusy(btn, true, 'Tworzenie konta…');
    setTimeout(() => { S.settings.name = name; S.settings.email = email; if (regRole === 'mentor') {
        S.wiz.name = name;
        S.role = 'mentor';
        S.name = name;
        $('#dev-role').value = 'mentor';
        toast('Konto utworzone – uzupełnij profil mentora');
        go('#/M01');
    }
    else {
        S.role = 'mentee';
        S.name = name;
        $('#dev-role').value = 'mentee';
        S.prefs.step = 1;
        toast('Konto utworzone. Wysłaliśmy e-mail weryfikacyjny.');
        go('#/U01');
    } }, 800);
};
/* ---------- P06 ---------- */
reg('P06', 'Reset hasła', [], () => `<div class="card" style="max-width:440px;margin:20px auto"><h1>Reset hasła</h1><div id="reset-body"><p class="mut">Podaj e-mail powiązany z kontem – wyślemy link do ustawienia nowego hasła.</p>
  <form data-form="reset" novalidate><div data-formerr></div>${field('email', 'E-mail', { type: 'email' })}<button class="btn block">Wyślij link</button></form></div><p class="small" style="margin-top:14px"><a href="#/P04">← Wróć do logowania</a></p></div>`);
forms['reset'] = f => {
    const email = val(f, 'email');
    if (!showErrors(f, isEmail(email) ? {} : { email: 'Podaj poprawny adres e-mail.' }))
        return;
    const btn = f.querySelector('button.btn');
    setBusy(btn, true, 'Wysyłanie…');
    setTimeout(() => { $('#reset-body').innerHTML = `<div class="alert ok">Jeśli konto istnieje, wysłaliśmy link do resetu hasła na adres <b>${esc(email)}</b>. Link jest ważny 1 godzinę.</div>`; }, 700);
};
// ---- screens-mentee.ts ----
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
    <form data-form="msg" data-id="${cur.id}" style="padding:12px;border-top:1px solid var(--line)" novalidate><div data-field="m"><div class="row"><input type="text" name="m" placeholder="Napisz wiadomość…" style="flex:1;width:auto" aria-label="Wiadomość"><button class="btn">Wyślij</button></div><div class="err" data-err="m" role="alert"></div></div></form></div></div>`;
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
// ---- screens-mentor.ts ----
/* ---------- M01 Kreator profilu ---------- */
const WIZ_STEPS = ['Podstawy', 'Tematy i cena', 'Weryfikacja', 'Podsumowanie'];
function wizBanner() {
    const st = S.wiz.status;
    return st === 'pending' ? `<div class="alert warn">⏳ Wniosek jest w weryfikacji (zwykle do 24 h). Edycja zostanie odblokowana po decyzji.</div>`
        : st === 'approved' ? `<div class="alert ok">✔ Profil zatwierdzony i widoczny w wyszukiwarce.</div>`
            : st === 'changes' ? `<div class="alert err">Zespół prosi o poprawki: ${esc(S.apps.find(a => a.id === 'aw')?.comment || '')}</div>` : '';
}
reg('M01', 'Profil mentora', ['mentor'], () => {
    if (S.view === 'loading')
        return skeleton('detail');
    if (S.view === 'error')
        return errorBox();
    const w = S.wiz;
    const locked = w.status === 'pending';
    const topicChips = (k, all) => `<div class="chips">${all.map(t => `<button type="button" class="chip ${w[k].includes(t) ? 'on' : ''}" data-act="wiz-chip" data-k="${k}" data-v="${t}" aria-pressed="${w[k].includes(t)}">${t}</button>`).join('')}</div>`;
    let body = '';
    if (locked || w.status === 'approved')
        body = `<h2>Podgląd profilu</h2><div class="mc">${avatar({ initials: w.name.split(' ').map(x => x[0]).join(''), color: '#db2777' }, 64)}<div><b>${esc(w.name)}</b><br>${esc(w.headline)}<p>${esc(w.bio)}</p>${w.topics.map(t => `<span class="tag">${t}</span>`).join('')}<p class="price">${w.price} zł/h</p></div></div>${w.status === 'approved' ? '<button class="btn sec" data-act="wiz-edit">Edytuj profil</button>' : ''}`;
    else if (w.step === 1)
        body = `<h2>Podstawowe informacje</h2>${field('name', 'Imię i nazwisko', { value: w.name })}${field('headline', 'Nagłówek profilu', { value: w.headline, hint: '10–80 znaków, np. „Senior PM – pomagam wejść w produkt”' })}${field('bio', 'O mnie', { area: true, value: w.bio, max: 1000, hint: '100–1000 znaków' })}`;
    else if (w.step === 2)
        body = `<h2>Tematy, języki i cena</h2><div class="field" data-field="topics"><label>Tematy (min. 1)</label>${topicChips('topics', TOPICS)}<div class="err" data-err="topics" role="alert"></div></div><div class="field" data-field="langs"><label>Języki (min. 1)</label>${topicChips('langs', LANGS)}<div class="err" data-err="langs" role="alert"></div></div>${field('price', 'Cena za 60 min (zł)', { type: 'number', value: w.price, hint: '20–300 zł. Prowizja platformy 20% – otrzymasz ' + (w.price ? Math.round(+w.price * 0.8) : '…') + ' zł.' })}`;
    else if (w.step === 3)
        body = `<h2>Weryfikacja</h2><p class="mut">Dodaj CV, dyplom lub certyfikat potwierdzający doświadczenie.</p><div class="field" data-field="doc"><label for="f-doc">Dokument (PDF/JPG/PNG, maks. 5 MB)</label><input id="f-doc" name="doc" type="file" accept=".pdf,.jpg,.jpeg,.png">${w.doc ? `<div class="hint">Dodano: ${esc(w.doc)}</div>` : ''}<div class="err" data-err="doc" role="alert"></div></div>
     <div class="field" data-field="consent"><label class="row" style="font-weight:400"><input type="checkbox" name="consent" ${w.consent ? 'checked' : ''}> Zgadzam się na weryfikację moich danych i dokumentów</label><div class="err" data-err="consent" role="alert"></div></div>`;
    else
        body = `<h2>Podsumowanie</h2><div class="stack"><div><b>${esc(w.name)}</b> – ${esc(w.headline)}</div><p>${esc(w.bio)}</p><div>${w.topics.map(t => `<span class="tag">${t}</span>`).join('')} ${w.langs.map(t => badge(t)).join(' ')}</div><div><b>${w.price} zł/h</b> · dokument: ${esc(w.doc)}</div></div><div class="alert info" style="margin-top:12px">Po wysłaniu wniosek trafi do weryfikacji. Poinformujemy Cię e-mailem.</div>`;
    const nav = locked || w.status === 'approved' ? '' : `<div class="row between" style="margin-top:20px"><span>${w.step > 1 ? '<button type="button" class="btn sec" data-act="wiz-back">Wstecz</button>' : ''}</span><button class="btn">${w.step === 4 ? 'Wyślij do weryfikacji' : 'Zapisz i dalej'}</button></div>`;
    return `<h1>Profil mentora</h1>${wizBanner()}<div class="card" style="max-width:720px">${locked || w.status === 'approved' ? '' : `<div class="steps">${WIZ_STEPS.map((_, i) => `<div class="${i < w.step ? 'on' : ''}"></div>`).join('')}</div><p class="mut small">Krok ${w.step} z 4 – ${WIZ_STEPS[w.step - 1]} · szkic zapisywany automatycznie</p>`}<form data-form="wiz" novalidate><div data-formerr></div>${body}${nav}</form></div>`;
});
function wizSaveFields() {
    const f = $('form[data-form=wiz]');
    if (!f)
        return;
    const w = S.wiz;
    const g = (n) => f.elements.namedItem(n);
    if (g('name')) {
        w.name = g('name').value;
        w.headline = g('headline').value;
        w.bio = g('bio').value;
    }
    if (g('price'))
        w.price = g('price').value;
}
actions['wiz-chip'] = el => { wizSaveFields(); const k = el.dataset.k, v = el.dataset.v; const a = S.wiz[k]; S.wiz[k] = a.includes(v) ? a.filter(x => x !== v) : [...a, v]; render(); };
actions['wiz-back'] = () => { wizSaveFields(); S.wiz.step--; render(); };
actions['wiz-edit'] = () => { S.wiz.status = 'draft'; S.wiz.step = 1; render(); };
forms['wiz'] = f => {
    const w = S.wiz;
    const errs = {};
    wizSaveFields();
    if (w.step === 1) {
        if (w.name.trim().length < 2)
            errs.name = 'Podaj imię i nazwisko.';
        const h = w.headline.trim().length;
        if (h < 10 || h > 80)
            errs.headline = 'Nagłówek: 10–80 znaków (teraz ' + h + ').';
        const b = w.bio.trim().length;
        if (b < 100 || b > 1000)
            errs.bio = 'Opis: 100–1000 znaków (teraz ' + b + ').';
    }
    if (w.step === 2) {
        if (!w.topics.length)
            errs.topics = 'Wybierz co najmniej jeden temat.';
        if (!w.langs.length)
            errs.langs = 'Wybierz co najmniej jeden język.';
        const p = +w.price;
        if (!w.price || isNaN(p) || p < 20 || p > 300)
            errs.price = 'Cena musi mieścić się w przedziale 20–300 zł.';
    }
    if (w.step === 3) {
        const fi = f.elements.namedItem('doc');
        const file = fi.files?.[0];
        if (file) {
            if (!/\.(pdf|jpe?g|png)$/i.test(file.name))
                errs.doc = 'Dozwolone formaty: PDF, JPG, PNG.';
            else if (file.size > 5 * 1024 * 1024)
                errs.doc = 'Plik jest za duży (maks. 5 MB).';
            else
                w.doc = file.name;
        }
        else if (!w.doc)
            errs.doc = 'Dodaj dokument potwierdzający doświadczenie.';
        w.consent = f.elements.namedItem('consent').checked;
        if (!w.consent)
            errs.consent = 'Zgoda na weryfikację jest wymagana.';
    }
    if (!showErrors(f, errs))
        return;
    if (w.step < 4) {
        toast('Szkic zapisany');
        w.step++;
        render();
        return;
    }
    const btn = f.querySelector('button.btn:last-child');
    setBusy(btn, true, 'Wysyłanie…');
    setTimeout(() => { w.status = 'pending'; S.apps = S.apps.filter(a => a.id !== 'aw'); S.apps.unshift({ id: 'aw', name: w.name, headline: w.headline, topics: w.topics, docs: [w.doc], submitted: 'przed chwilą', status: 'pending', bio: w.bio }); toast('Wniosek wysłany do weryfikacji'); render(); }, 900);
};
/* ---------- M02 Dashboard ---------- */
reg('M02', 'Dashboard mentora', ['mentor'], () => withState({ emptyHtml: emptyBox('📅', 'Brak sesji', 'Uzupełnij dostępność, aby uczniowie mogli Cię rezerwować.', { label: 'Ustaw dostępność', href: '#/M03' }), skel: 'detail' }, () => `<h1>Cześć, ${esc(S.name.split(' ')[0])}!</h1>${wizBanner() || `<div class="alert info">Uzupełnij profil, aby pojawić się w wyszukiwarce. <a href="#/M01">Przejdź do kreatora</a></div>`}
  <div class="grid g3"><div class="card"><div class="stat">${S.requests.length}</div><div class="mut">nowych próśb</div><a href="#/M04">Zobacz →</a></div><div class="card"><div class="stat">${S.mentorUpcoming.length}</div><div class="mut">nadchodzących sesji</div></div><div class="card"><div class="stat">${S.balance.available + S.balance.pending} zł</div><div class="mut">saldo (dostępne + oczekujące)</div><a href="#/M06">Zarobki →</a></div></div>
  <div class="card" style="margin-top:16px"><h2>Nadchodzące sesje</h2>${S.mentorUpcoming.length ? S.mentorUpcoming.map(u => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><span><b>${u.student}</b> · ${u.topic}<br><span class="mut small">${fmtDT(u.start)}</span></span><span class="row"><a class="btn sm sec" href="#/U07/${u.id}">Szczegóły</a><button class="btn sm" data-act="join" data-id="${u.id}">Wejdź do sali</button></span></div>`).join('') : emptyBox('📅', 'Brak sesji', 'Uzupełnij dostępność.', { label: 'Ustaw dostępność', href: '#/M03' })}</div>`));
/* ---------- M03 Dostępność ---------- */
const DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
reg('M03', 'Dostępność', ['mentor'], () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8);
    return `<h1>Dostępność</h1><p class="mut">Kliknij komórki, aby zaznaczyć godziny, w których przyjmujesz uczniów.</p>` + withState({ empty: S.avail.size === 0, emptyHtml: emptyBox('🗓', 'Nie masz ustawionej dostępności', 'Profil nie jest widoczny w wyszukiwarce, dopóki nie dodasz terminów.', { label: 'Dodaj typowe godziny (pon–pt 18–20)', act: 'av-preset' }), skel: 'detail' }, () => `<form data-form="av-save" novalidate><div data-formerr></div><div class="card"><div class="avgrid"><span></span>${DAYS.map(d => `<span class="h">${d}</span>`).join('')}${hours.map(h => `<span class="h">${h}:00</span>${DAYS.map((_, d) => `<button type="button" class="c ${S.avail.has(d + '-' + h) ? 'on' : ''}" data-act="av" data-k="${d}-${h}" aria-label="${DAYS[d]} ${h}:00" aria-pressed="${S.avail.has(d + '-' + h)}"></button>`).join('')}`).join('')}</div></div>
    <div class="grid g3" style="margin-top:16px"><div class="card">${selectField('tz', 'Strefa czasowa', [['Europe/Warsaw', 'Europe/Warsaw'], ['Europe/Berlin', 'Europe/Berlin']])}</div><div class="card">${selectField('buf', 'Bufor między sesjami', [['0', 'Brak'], ['10', '10 min'], ['15', '15 min']], '10')}</div><div class="card">${selectField('mode', 'Tryb rezerwacji', [['auto', 'Natychmiastowa'], ['manual', 'Ręczna akceptacja']], 'manual')}</div></div>
    <div class="row between" style="margin-top:16px"><span class="mut" id="avcount">${S.avail.size} godz./tydz.${S.availSaved ? '' : ' · niezapisane zmiany'}</span><button class="btn">Zapisz dostępność</button></div></form>`);
});
actions['av'] = el => { const k = el.dataset.k; if (S.avail.has(k))
    S.avail.delete(k);
else
    S.avail.add(k); el.classList.toggle('on'); el.setAttribute('aria-pressed', String(S.avail.has(k))); S.availSaved = false; $('#avcount').textContent = S.avail.size + ' godz./tydz. · niezapisane zmiany'; };
actions['av-preset'] = () => { for (let d = 0; d < 5; d++) {
    S.avail.add(d + '-18');
    S.avail.add(d + '-19');
} S.view = 'ok'; render(); };
forms['av-save'] = f => {
    if (!showErrors(f, S.avail.size ? {} : { form: 'Dodaj przynajmniej jeden termin, aby profil był widoczny.' }))
        return;
    const btn = f.querySelector('button.btn');
    setBusy(btn, true, 'Zapisywanie…');
    setTimeout(() => { S.availSaved = true; toast('Dostępność zapisana'); render(); }, 600);
};
/* ---------- M04 Prośby ---------- */
reg('M04', 'Prośby o rezerwację', ['mentor'], () => `<h1>Prośby o rezerwację</h1>` + withState({ empty: S.requests.length === 0, emptyHtml: emptyBox('📭', 'Brak nowych próśb', 'Gdy uczeń poprosi o sesję, zobaczysz ją tutaj.'), skel: 'list' }, () => `<div class="stack">${S.requests.map(r => `<div class="card mc">${avatar(r, 48)}<div class="body"><div class="row between"><h3>${r.student}</h3>${badge('wygasa za ' + r.hoursLeft + ' h', r.hoursLeft < 8 ? 'err' : 'warn')}</div><p>${r.topic}<br><b>${fmtDT(r.start)}</b></p>${r.message ? `<p class="mut">„${esc(r.message)}”</p>` : ''}<div class="row"><button class="btn sm" data-act="req-accept" data-id="${r.id}">Akceptuj</button><button class="btn sm sec" data-act="req-decline" data-id="${r.id}">Odrzuć</button></div></div></div>`).join('')}</div>`));
actions['req-accept'] = el => {
    const r = S.requests.find(x => x.id === el.dataset.id);
    if (S.mentorUpcoming.some(u => +u.start === +r.start)) {
        toast('Kolizja terminów – masz już sesję w tym czasie', 'err');
        return;
    }
    S.mentorUpcoming.push({ id: r.id, student: r.student, start: r.start, topic: r.topic });
    S.requests = S.requests.filter(x => x !== r);
    toast(`Zaakceptowano – ${r.student} dostał powiadomienie`);
    render();
};
actions['req-decline'] = el => modal(`<h2>Odrzuć prośbę</h2><form data-form="decline" data-id="${el.dataset.id}" novalidate>${selectField('reason', 'Powód (zobaczy go uczeń)', [['', 'Wybierz…'], ['busy', 'Termin przestał być dostępny'], ['topic', 'Temat poza moim zakresem'], ['other', 'Inny']])}<p class="hint">Uczeń otrzyma pełny zwrot.</p><div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Wróć</button><button class="btn danger">Odrzuć</button></div></form>`);
forms['decline'] = f => { if (!showErrors(f, val(f, 'reason') ? {} : { reason: 'Wybierz powód odrzucenia.' }))
    return; S.requests = S.requests.filter(x => x.id !== f.dataset.id); closeModal(); toast('Prośba odrzucona, uczeń otrzyma zwrot'); render(); };
/* ---------- M05 Uczniowie ---------- */
function studentsHtml() {
    const q = S.studentQ.toLowerCase();
    const list = S.students.map((s, i) => ({ ...s, i })).filter(s => s.name.toLowerCase().includes(q));
    return withState({ empty: list.length === 0, emptyHtml: emptyBox('🎓', q ? 'Brak wyników' : 'Nie masz jeszcze uczniów', q ? 'Spróbuj innej frazy.' : 'Uzupełnij profil i dostępność, aby zwiększyć widoczność.', q ? undefined : { label: 'Edytuj profil', href: '#/M01' }) }, () => `<div class="card pad0"><table><tr><th>Uczeń</th><th>Sesje</th><th>Ostatnia</th><th>Notatka</th><th></th></tr>${list.map(s => `<tr><td><span class="row">${avatar(s, 32)} ${s.name}</span></td><td>${s.sessions}</td><td>${s.last}</td><td class="mut">${esc(s.note.slice(0, 30)) || '—'}</td><td class="right"><button class="btn sm sec" data-act="stu-note" data-i="${s.i}">Notatka</button> <a class="btn sm" href="#/U10/s${s.i}">Napisz</a></td></tr>`).join('')}</table></div>`);
}
reg('M05', 'Moi uczniowie', ['mentor'], () => `<h1>Moi uczniowie</h1><div class="field"><input type="search" placeholder="Szukaj ucznia…" value="${esc(S.studentQ)}" data-input="studq" aria-label="Szukaj ucznia" style="max-width:320px"></div><div id="stu">${studentsHtml()}</div>`);
inputs['studq'] = el => { S.studentQ = el.value; $('#stu').innerHTML = studentsHtml(); };
actions['stu-note'] = el => { const s = S.students[+el.dataset.i]; modal(`<h2>Notatka o: ${s.name}</h2><form data-form="stu-note" data-i="${el.dataset.i}" novalidate>${field('note', '', { area: true, value: s.note, max: 2000, hint: 'Widoczna tylko dla Ciebie. Maks. 2000 znaków.' })}<div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn">Zapisz</button></div></form>`); };
forms['stu-note'] = f => { if (!showErrors(f, val(f, 'note').length <= 2000 ? {} : { note: 'Maks. 2000 znaków.' }))
    return; S.students[+f.dataset.i].note = val(f, 'note'); closeModal(); toast('Notatka zapisana'); render(); };
/* ---------- M06 Zarobki ---------- */
function ibanValid(raw) { const s = raw.replace(/\s/g, '').toUpperCase(); if (!/^PL\d{26}$/.test(s))
    return false; const r = s.slice(4) + s.slice(0, 4); let rem = 0; for (const ch of r) {
    const v = /\d/.test(ch) ? ch : String(ch.charCodeAt(0) - 55);
    for (const d of v)
        rem = (rem * 10 + +d) % 97;
} return rem === 1; }
reg('M06', 'Zarobki i wypłaty', ['mentor'], () => `<h1>Zarobki i wypłaty</h1>` + withState({ empty: S.txs.length === 0, emptyHtml: emptyBox('💸', 'Brak transakcji', 'Zarobki pojawią się po pierwszej sesji.'), skel: 'detail' }, () => {
    const mo = [['Maj', 720], ['Cze', 960], ['Lip', 1100], ['Sie', 840], ['Wrz', 1260], ['Paź', 1044]];
    return `<div class="grid g3"><div class="card"><div class="stat">${S.balance.available} zł</div><div class="mut">dostępne do wypłaty</div></div><div class="card"><div class="stat">${S.balance.pending} zł</div><div class="mut">oczekujące (T+7)</div></div><div class="card"><div class="stat">${S.balance.paid} zł</div><div class="mut">wypłacone łącznie</div></div></div>
  <div class="cols-r" style="margin-top:16px"><div class="stack"><div class="card"><h2>Przychody miesięczne</h2><div class="bars" style="margin-bottom:28px">${mo.map(m => `<div style="height:${m[1] / 1260 * 100}%" title="${m[1]} zł"><span>${m[0]}</span></div>`).join('')}</div></div>
   <div class="card pad0"><table><tr><th>Data</th><th>Opis</th><th>Kwota</th><th>Status</th></tr>${S.txs.map(t => `<tr><td>${t.date}</td><td>${t.desc}</td><td style="color:${t.amount < 0 ? 'var(--err)' : 'var(--ok)'}">${t.amount} zł</td><td>${t.status}</td></tr>`).join('')}</table></div></div>
   <form class="card" data-form="payout" novalidate><h2>Wypłata</h2><div data-formerr></div>${field('amount', 'Kwota (zł)', { type: 'number', hint: `Min. 50 zł, maks. ${S.balance.available} zł` })}${field('iban', 'Numer konta (IBAN)', { value: S.payoutIban, ph: 'PL61 1090 1014 0000 0712 1981 2874', hint: 'Demo: PL61109010140000071219812874' })}<button class="btn block">Zleć wypłatę</button></form></div>`;
}));
forms['payout'] = f => {
    const errs = {};
    const amt = +val(f, 'amount');
    if (!val(f, 'amount') || isNaN(amt))
        errs.amount = 'Podaj kwotę wypłaty.';
    else if (amt < 50)
        errs.amount = 'Minimalna kwota wypłaty to 50 zł.';
    else if (amt > S.balance.available)
        errs.amount = `Kwota przekracza dostępne środki (${S.balance.available} zł).`;
    if (!ibanValid(val(f, 'iban')))
        errs.iban = 'Niepoprawny numer IBAN (PL + 26 cyfr).';
    if (!showErrors(f, errs))
        return;
    const btn = f.querySelector('button.btn');
    setBusy(btn, true, 'Zlecanie…');
    setTimeout(() => { S.balance.available -= amt; S.balance.paid += amt; S.payoutIban = val(f, 'iban'); S.txs.unshift({ date: 'dziś', desc: 'Wypłata na konto', amount: -amt, status: 'W realizacji' }); toast('Wypłata zlecona – środki dotrą w 1–2 dni'); render(); }, 900);
};
// ---- screens-admin.ts ----
/* ---------- A01 Wnioski ---------- */
const appStatus = (s) => ({ pending: badge('Oczekuje', 'warn'), approved: badge('Zatwierdzony', 'ok'), rejected: badge('Odrzucony', 'err'), changes: badge('Do poprawy', 'p') })[s];
reg('A01', 'Wnioski mentorów', ['admin'], () => {
    const t = S.tab.apps || 'pending';
    const list = S.apps.filter(a => t === 'all' || a.status === t);
    const sel = list.find(a => a.id === S.selApp) || list[0];
    return `<h1>Wnioski mentorów</h1>${tabsHtml('apps', [['pending', 'Oczekujące'], ['changes', 'Do poprawy'], ['approved', 'Zatwierdzone'], ['rejected', 'Odrzucone'], ['all', 'Wszystkie']], 'pending')}` +
        withState({ empty: list.length === 0, emptyHtml: emptyBox('🎉', 'Kolejka pusta', 'Brak wniosków w tym statusie.'), skel: 'list' }, () => `<div class="cols" style="grid-template-columns:340px 1fr"><div class="card pad0 convs">${list.map(a => `<a href="#/A01" data-act="app-sel" data-id="${a.id}" class="${sel.id === a.id ? 'on' : ''}"><div><b>${a.name}</b><br><span class="mut small">${a.headline}</span><br>${appStatus(a.status)} <span class="mut small">${a.submitted}</span></div></a>`).join('')}</div>
      <div class="card"><div class="row between"><h2>${sel.name}</h2>${appStatus(sel.status)}</div><p><b>${sel.headline}</b></p><p>${esc(sel.bio)}</p><div>${sel.topics.map(x => `<span class="tag">${x}</span>`).join('')}</div>
      <h3 style="margin-top:12px">Dokumenty</h3>${sel.docs.map(d => `<div>📎 ${esc(d)} <button class="btn sm sec" data-act="toast" data-m="Podgląd dokumentu (mock)">Podgląd</button></div>`).join('')}
      ${sel.comment ? `<div class="alert info" style="margin-top:12px">Komentarz: ${esc(sel.comment)}</div>` : ''}
      ${sel.status === 'pending' || sel.status === 'changes' ? `<div class="row" style="margin-top:16px"><button class="btn" data-act="app-approve" data-id="${sel.id}">Zatwierdź</button><button class="btn sec" data-act="app-decide" data-d="changes" data-id="${sel.id}">Poproś o poprawki</button><button class="btn danger" data-act="app-decide" data-d="rejected" data-id="${sel.id}">Odrzuć</button></div>` : ''}</div></div>`);
});
function setApp(id, status, comment) {
    const a = S.apps.find(x => x.id === id);
    a.status = status;
    if (comment)
        a.comment = comment;
    if (id === 'aw')
        S.wiz.status = status === 'approved' ? 'approved' : status === 'changes' ? 'changes' : 'draft';
}
actions['app-sel'] = (el, e) => { e.preventDefault(); S.selApp = el.dataset.id; render(); };
actions['app-approve'] = el => { setApp(el.dataset.id, 'approved'); toast('Mentor zatwierdzony – e-mail wysłany'); render(); };
actions['app-decide'] = el => modal(`<h2>${el.dataset.d === 'changes' ? 'Poproś o poprawki' : 'Odrzuć wniosek'}</h2><form data-form="app-decide" data-id="${el.dataset.id}" data-d="${el.dataset.d}" novalidate>${field('comment', 'Komentarz dla mentora', { area: true, hint: 'Min. 10 znaków. Zostanie wysłany e-mailem.' })}<div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn ${el.dataset.d === 'rejected' ? 'danger' : ''}">Zapisz decyzję</button></div></form>`);
forms['app-decide'] = f => { if (!showErrors(f, val(f, 'comment').length >= 10 ? {} : { comment: 'Komentarz musi mieć co najmniej 10 znaków.' }))
    return; setApp(f.dataset.id, f.dataset.d, val(f, 'comment')); closeModal(); toast('Decyzja zapisana (audyt)'); render(); };
/* ---------- A02 Zgłoszenia ---------- */
const sev = (s) => ({ high: badge('Wysoki', 'err'), med: badge('Średni', 'warn'), low: badge('Niski', '') })[s];
reg('A02', 'Zgłoszenia i spory', ['admin'], () => {
    const t = S.tab.reports || 'open';
    const list = S.reports.filter(r => r.status === t);
    const sel = list.find(r => r.id === S.selReport) || list[0];
    return `<h1>Zgłoszenia i spory</h1>${tabsHtml('reports', [['open', 'Otwarte'], ['resolved', 'Rozwiązane']], 'open')}` +
        withState({ empty: list.length === 0, emptyHtml: emptyBox('✅', 'Brak zgłoszeń', t === 'open' ? 'Wszystkie zgłoszenia zostały obsłużone.' : 'Brak rozwiązanych zgłoszeń.'), skel: 'list' }, () => `<div class="cols" style="grid-template-columns:340px 1fr"><div class="card pad0 convs">${list.map(r => `<a href="#/A02" data-act="rep-sel" data-id="${r.id}" class="${sel.id === r.id ? 'on' : ''}"><div>${sev(r.severity)} <b>${r.type}</b><br><span class="mut small">${r.target}</span></div></a>`).join('')}</div>
      <div class="card"><div class="row between"><h2>${sel.type}</h2>${sev(sel.severity)}</div><p class="mut small">Zgłasza: ${sel.reporter} · dotyczy: ${sel.target}</p><div class="card" style="background:var(--bg)">${esc(sel.text)}</div>
      ${sel.status === 'open' ? `<form data-form="resolve" data-id="${sel.id}" novalidate style="margin-top:16px"><div data-formerr></div>${selectField('decision', 'Decyzja', [['', 'Wybierz…'], ['dismiss', 'Oddal zgłoszenie'], ['warn', 'Ostrzeż użytkownika'], ['suspend', 'Zawieś konto']])}${field('refund', 'Zwrot dla ucznia (zł, opcjonalnie)', { type: 'number', hint: 'Maks. 150 zł (kwota sesji)' })}${field('note', 'Notatka (min. 10 znaków)', { area: true })}<button class="btn">Zapisz decyzję</button></form>` : `<div class="alert ok" style="margin-top:12px">Rozwiązano: ${esc(sel.resolution || '')}</div>`}</div></div>`);
});
actions['rep-sel'] = (el, e) => { e.preventDefault(); S.selReport = el.dataset.id; render(); };
forms['resolve'] = f => {
    const errs = {};
    if (!val(f, 'decision'))
        errs.decision = 'Wybierz decyzję.';
    const rf = val(f, 'refund');
    if (rf && (+rf < 0 || +rf > 150))
        errs.refund = 'Zwrot: 0–150 zł.';
    if (val(f, 'note').length < 10)
        errs.note = 'Notatka musi mieć co najmniej 10 znaków.';
    if (!showErrors(f, errs))
        return;
    const r = S.reports.find(x => x.id === f.dataset.id);
    r.status = 'resolved';
    r.resolution = f.elements.namedItem('decision').selectedOptions[0].text + (rf ? `, zwrot ${rf} zł` : '');
    toast('Zgłoszenie rozwiązane, zgłaszający powiadomiony');
    render();
};
/* ---------- A03 Użytkownicy ---------- */
function usersHtml() {
    const q = S.userQ.toLowerCase();
    const list = S.users.filter(u => (!q || (u.name + u.email).toLowerCase().includes(q)) && (!S.userRole || u.role === S.userRole));
    return withState({ empty: list.length === 0, emptyHtml: emptyBox('🔍', 'Brak wyników', 'Zmień kryteria wyszukiwania.') }, () => `<div class="card pad0"><table><tr><th>Użytkownik</th><th>Rola</th><th>Od</th><th>Status</th><th></th></tr>${list.map(u => `<tr><td><b>${u.name}</b><br><span class="mut small">${u.email}</span></td><td>${u.role}</td><td>${u.joined}</td><td>${u.status === 'active' ? badge('aktywny', 'ok') : badge('zawieszony', 'err')}</td><td class="right">${u.status === 'active' ? `<button class="btn sm sec" data-act="user-suspend" data-id="${u.id}">Zawieś</button>` : `<button class="btn sm" data-act="user-activate" data-id="${u.id}">Odblokuj</button>`}</td></tr>`).join('')}</table></div>`);
}
reg('A03', 'Użytkownicy', ['admin'], () => `<h1>Użytkownicy</h1><div class="row" style="margin-bottom:12px"><input type="search" placeholder="Szukaj po imieniu lub e-mailu…" value="${esc(S.userQ)}" data-input="userq" style="max-width:320px" aria-label="Szukaj użytkownika"><select data-input="userrole" style="width:auto" aria-label="Rola"><option value="">Wszystkie role</option><option value="mentee" ${S.userRole === 'mentee' ? 'selected' : ''}>Uczniowie</option><option value="mentor" ${S.userRole === 'mentor' ? 'selected' : ''}>Mentorzy</option><option value="admin" ${S.userRole === 'admin' ? 'selected' : ''}>Admini</option></select></div><div id="users">${usersHtml()}</div>`);
inputs['userq'] = el => { S.userQ = el.value; $('#users').innerHTML = usersHtml(); };
inputs['userrole'] = el => { S.userRole = el.value; $('#users').innerHTML = usersHtml(); };
actions['user-suspend'] = el => {
    if (el.dataset.id === 'u0') {
        toast('Nie możesz zawiesić własnego konta', 'err');
        return;
    }
    modal(`<h2>Zawiesić użytkownika?</h2><form data-form="suspend" data-id="${el.dataset.id}" novalidate>${field('reason', 'Powód zawieszenia', { area: true, hint: 'Min. 10 znaków' })}<div class="row" style="justify-content:flex-end"><button type="button" class="btn sec" data-act="modal-close">Anuluj</button><button class="btn danger">Zawieś</button></div></form>`);
};
forms['suspend'] = f => { if (!showErrors(f, val(f, 'reason').length >= 10 ? {} : { reason: 'Podaj powód (min. 10 znaków).' }))
    return; S.users.find(u => u.id === f.dataset.id).status = 'suspended'; closeModal(); toast('Konto zawieszone'); render(); };
actions['user-activate'] = el => { S.users.find(u => u.id === el.dataset.id).status = 'active'; toast('Konto odblokowane'); render(); };
// ---- app.ts ----
const DEFAULT_PARAM = { P03: 'm1', U03: 'm1', U04: 'm1', U05: 'b1', U07: 'b1', U08: 'b1', U09: 'b2', U10: 'm1' };
const PERSONA = { guest: '', mentee: 'Kasia Wiśniewska', mentor: 'Marta Zielińska', admin: 'Ola Moderator' };
function parseHash() {
    const parts = location.hash.replace(/^#\/?/, '').split('?')[0].split('/');
    return [parts[0] || 'P01', parts[1]];
}
function render() {
    let [id, param] = parseHash();
    let sc = SCREENS[id];
    const app = $('#app');
    if (!sc) {
        app.innerHTML = emptyBox('🧭', 'Nie znaleziono strony (404)', 'Adres jest nieprawidłowy lub strona została przeniesiona.', { label: 'Strona główna', href: '#/P01' });
        renderNav();
        return;
    }
    if (sc.roles.length && !sc.roles.includes(S.role)) {
        if (S.role === 'guest') {
            S.returnTo = location.hash;
            location.replace('#/P04');
            return;
        }
        app.innerHTML = emptyBox('🔒', 'Brak dostępu', `Ten ekran jest dostępny dla roli: ${sc.roles.join(', ')}. Jesteś zalogowany jako ${S.role}.`, { label: 'Przejdź do swojego panelu', href: homeFor(S.role) });
        renderNav();
        return;
    }
    app.innerHTML = sc.render(param);
    after[id]?.();
    renderNav();
    $('#dev-screen').value = id;
    $('#dev-view').value = S.view;
}
function renderNav() {
    const unread = S.notifs.filter(n => !n.read).length;
    const cur = location.hash;
    const L = (h, t) => `<a class="l ${cur.startsWith(h) ? 'on' : ''}" href="${h}">${t}</a>`;
    const bell = `<a class="l bell" href="#/S02" aria-label="Powiadomienia">🔔${unread ? `<span class="dot">${unread}</span>` : ''}</a>`;
    const by = {
        guest: L('#/P02', 'Znajdź mentora') + L('#/P05', 'Zostań mentorem') + '<span class="sp"></span>' + L('#/P04', 'Zaloguj się') + '<a class="btn sm" href="#/P05" data-act="reg-mentee">Załóż konto</a>',
        mentee: L('#/P02', 'Znajdź mentora') + L('#/U06', 'Moje sesje') + L('#/U10', 'Wiadomości') + L('#/U11', 'Ulubieni') + '<span class="sp"></span>' + bell + L('#/U12', 'Płatności') + L('#/S01', 'Ustawienia') + '<button class="btn sm sec" data-act="logout">Wyloguj</button>',
        mentor: L('#/M02', 'Dashboard') + L('#/M03', 'Kalendarz') + L('#/M04', `Prośby${S.requests.length ? ` <span class="dot">${S.requests.length}</span>` : ''}`) + L('#/M05', 'Uczniowie') + L('#/U10', 'Wiadomości') + L('#/M06', 'Zarobki') + L('#/M01', 'Profil') + '<span class="sp"></span>' + bell + L('#/S01', 'Ustawienia') + '<button class="btn sm sec" data-act="logout">Wyloguj</button>',
        admin: L('#/A01', 'Wnioski mentorów') + L('#/A02', 'Zgłoszenia') + L('#/A03', 'Użytkownicy') + '<span class="sp"></span>' + bell + L('#/S01', 'Ustawienia') + '<button class="btn sm sec" data-act="logout">Wyloguj</button>',
    };
    $('#nav').innerHTML = `<nav class="nav" aria-label="Główna nawigacja"><span class="logo" data-act="home">MentorHub</span>${by[S.role]}</nav>`;
}
actions['home'] = () => go(homeFor(S.role));
actions['reg-mentee'] = () => { regRole = 'mentee'; };
actions['logout'] = () => { S.role = 'guest'; $('#dev-role').value = 'guest'; toast('Wylogowano'); go('#/P01'); };
actions['modal-close'] = () => closeModal();
actions['retry'] = () => { S.view = 'loading'; render(); setTimeout(() => { S.view = 'ok'; render(); }, 800); };
document.addEventListener('click', e => {
    const t = e.target;
    if (t.classList.contains('modal')) {
        closeModal();
        return;
    }
    const el = t.closest('[data-act]');
    if (el)
        actions[el.dataset.act]?.(el, e);
});
document.addEventListener('submit', e => { const f = e.target.closest('form[data-form]'); if (f) {
    e.preventDefault();
    forms[f.dataset.form]?.(f);
} });
document.addEventListener('input', e => {
    const el = e.target;
    if (['checkbox', 'radio', 'select-one', 'file'].includes(el.type))
        return;
    if (el.name === 'cardnum')
        el.value = el.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (el.matches('form[data-form=register] input[name=password]'))
        inputs['pw'](el);
    const d = el.closest('[data-input]');
    if (d)
        inputs[d.dataset.input]?.(d);
});
document.addEventListener('change', e => {
    const el = e.target;
    if (!['checkbox', 'radio', 'select-one', 'file'].includes(el.type))
        return;
    if (el.name === 'tags')
        el.closest('label').classList.toggle('on', el.checked);
    const d = el.closest('[data-input]');
    if (d)
        inputs[d.dataset.input]?.(d);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape')
    closeModal(); });
window.addEventListener('hashchange', () => { S.view = 'ok'; closeModal(); render(); window.scrollTo(0, 0); $('#app').focus({ preventScroll: true }); });
/* Pasek demo */
(function initDev() {
    const sel = $('#dev-screen');
    sel.innerHTML = Object.values(SCREENS).map(s => `<option value="${s.id}">${s.id} ${s.title}</option>`).join('');
    $('#dev-role').addEventListener('change', e => { S.role = e.target.value; S.name = PERSONA[S.role]; S.returnTo = ''; S.view = 'ok'; go(homeFor(S.role)); });
    $('#dev-view').addEventListener('change', e => { S.view = e.target.value; render(); });
    sel.addEventListener('change', () => {
        const id = sel.value;
        const sc = SCREENS[id];
        if (sc.roles.length && !sc.roles.includes(S.role)) {
            S.role = sc.roles[0];
            S.name = PERSONA[S.role];
            $('#dev-role').value = S.role;
        }
        if (id === 'U04' && !S.draft) {
            const m = MENTORS[0];
            const s = mentorSlots(m).find(x => x.times.length);
            S.draft = { mentorId: m.id, type: 'trial', slot: slotKey(s.day, s.times[0]), note: '', promo: 0 };
        }
        const p = id === 'U10' && S.role === 'mentor' ? 's0' : DEFAULT_PARAM[id];
        S.view = 'ok';
        go('#/' + id + (p ? '/' + p : ''));
    });
    if (!location.hash)
        location.hash = '#/P01';
    else
        render();
})();

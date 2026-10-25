"use strict";
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

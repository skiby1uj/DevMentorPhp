"use strict";
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

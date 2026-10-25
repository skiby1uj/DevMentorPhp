const TOPICS = ['Rozwój kariery', 'Programowanie', 'Product management', 'Biznes i startupy', 'Data science', 'Angielski biznesowy', 'Design / UX', 'Przywództwo'];
const LANGS = ['Polski', 'Angielski', 'Niemiecki'];

const MENTORS: Mentor[] = [
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

const REVIEWS: Review[] = [
  { mentorId: 'm1', author: 'Kasia W.', rating: 5, text: 'Świetna sesja – konkretny plan przejścia do PM i feedback do CV. Polecam!', date: '2 tyg. temu' },
  { mentorId: 'm1', author: 'Michał T.', rating: 5, text: 'Anna świetnie przygotowała mnie do rozmowy rekrutacyjnej. Dostałem ofertę.', date: '1 mies. temu' },
  { mentorId: 'm1', author: 'Ola S.', rating: 4, text: 'Bardzo merytorycznie, trochę zabrakło czasu na pytania.', date: '2 mies. temu' },
  { mentorId: 'm2', author: 'Bartek R.', rating: 5, text: 'Code review na żywo to coś, czego mi brakowało. Dużo praktyki.', date: '3 tyg. temu' },
  { mentorId: 'm2', author: 'Iga P.', rating: 5, text: 'Pomógł mi poukładać wiedzę o architekturze.', date: '2 mies. temu' },
  { mentorId: 'm3', author: 'Paweł D.', rating: 5, text: 'Po 3 sesjach czuję się pewniej jako nowy lider.', date: '1 tyg. temu' },
  { mentorId: 'm6', author: 'Natalia K.', rating: 5, text: 'Prezentacje po angielsku przestały mnie stresować.', date: '5 dni temu' },
];

const SLOT_TIMES = [['17:00', '18:00', '19:30'], ['09:00', '12:00', '18:00', '20:00'], ['16:00', '17:30', '19:00'], ['08:00', '13:00', '21:00']];

function addDays(n: number, h = 0, m = 0): Date { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(h, m, 0, 0); return d; }

function mentorSlots(m: Mentor): { day: Date; times: string[] }[] {
  const out: { day: Date; times: string[] }[] = [];
  for (let i = 1; i <= 7; i++) {
    const base = SLOT_TIMES[(m.seed + i) % SLOT_TIMES.length];
    out.push({ day: addDays(i), times: (m.seed + i) % 5 === 0 ? [] : base });
  }
  return out;
}

const fmtDay = (d: Date) => d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' });
const fmtDT = (d: Date) => d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'long' }) + ', ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
const pln = (n: number) => n.toFixed(2).replace('.', ',') + ' zł';

interface Store {
  role: Role; name: string; view: ViewState; returnTo: string;
  favorites: Set<string>;
  filters: { q: string; topic: string; priceMax: number; lang: string; ratingMin: number; soon: boolean; sort: string; shown: number };
  bookings: Booking[];
  draft: { mentorId: string; type: 'trial' | 'single' | 'pack'; slot: string; note: string; promo: number } | null;
  convs: Record<string, Msg[]>;
  prefs: { goal: string; level: string; budget: number; times: string[]; step: number; done: boolean };
  wiz: { step: number; name: string; headline: string; bio: string; topics: string[]; price: string; langs: string[]; doc: string; consent: boolean; status: 'draft' | 'pending' | 'approved' | 'changes' };
  requests: MentorRequest[];
  mentorUpcoming: { id: string; student: string; start: Date; topic: string }[];
  avail: Set<string>; availSaved: boolean;
  students: { name: string; initials: string; color: string; sessions: number; last: string; note: string }[];
  balance: { available: number; pending: number; paid: number }; payoutIban: string;
  txs: { date: string; desc: string; amount: number; status: string }[];
  apps: Application[]; reports: ReportItem[]; users: UserRow[];
  notifs: Notif[]; cards: Card[]; tab: Record<string, string>;
  settings: { name: string; email: string; tz: string; lang: string; mail: boolean; push: boolean; reminders: boolean; marketing: boolean };
  roomMic: boolean; roomCam: boolean; roomShare: boolean; roomStart: number;
  userQ: string; userRole: string; studentQ: string; selApp: string; selReport: string;
}

const S: Store = {
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

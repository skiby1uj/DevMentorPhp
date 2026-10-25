type Role = 'guest' | 'mentee' | 'mentor' | 'admin';
type ViewState = 'ok' | 'loading' | 'empty' | 'error';

interface Mentor {
  id: string; name: string; initials: string; color: string; headline: string;
  topics: string[]; langs: string[]; country: string; price: number; trial: number;
  rating: number; reviews: number; students: number; lessons: number;
  bio: string; experience: string[]; verified: boolean; manual: boolean; seed: number;
}
interface Review { mentorId: string; author: string; rating: number; text: string; date: string; }
interface Booking {
  id: string; mentorId: string; start: Date; durationMin: number; topic: string;
  status: 'pending' | 'upcoming' | 'done' | 'cancelled'; price: number; reviewed: boolean; note?: string;
}
interface MentorRequest { id: string; student: string; initials: string; color: string; start: Date; topic: string; message: string; hoursLeft: number; }
interface Msg { from: 'me' | 'them'; text: string; time: string; }
interface Application { id: string; name: string; headline: string; topics: string[]; docs: string[]; submitted: string; status: 'pending' | 'approved' | 'rejected' | 'changes'; comment?: string; bio: string; }
interface ReportItem { id: string; severity: 'low' | 'med' | 'high'; type: string; reporter: string; target: string; text: string; status: 'open' | 'resolved'; resolution?: string; }
interface UserRow { id: string; name: string; email: string; role: Role; status: 'active' | 'suspended'; joined: string; }
interface Notif { id: string; text: string; time: string; read: boolean; href: string; }
interface Card { id: string; brand: string; last4: string; exp: string; def: boolean; }
interface ScreenDef {
  id: string; title: string; roles: Role[]; // pusta tablica = każdy
  render: (param?: string) => string;
}

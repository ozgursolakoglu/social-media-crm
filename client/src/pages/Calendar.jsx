import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const [viewDate, setViewDate] = useState(new Date());

  const days = eachDayOfInterval({ start: startOfMonth(viewDate), end: endOfMonth(viewDate) });
  const monthName = format(viewDate, 'MMMM yyyy');

  const prev = () => setViewDate(subMonths(viewDate, 1));
  const next = () => setViewDate(addMonths(viewDate, 1));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="page-title">Posting Calendar</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn" onClick={prev}><ChevronLeft size={18} /></button>
          <span style={{ fontWeight: 700 }}>{monthName}</span>
          <button className="btn" onClick={next}><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 900 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
          {days.map((day) => {
            const current = isSameDay(day, new Date());
            const sameMonth = isSameMonth(day, viewDate);
            return (
              <div
                key={day.toISOString()}
                style={{
                  aspectRatio: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: sameMonth ? '#111827' : '#9ca3af',
                  border: current ? '2px solid #2563eb' : '1px solid transparent',
                  borderRadius: '8px',
                  background: current ? '#dbeafe' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem', color: '#6b7280' }}>{format(day, 'MMM d')}</div>
                <div style={{ width: 20, height: 4, borderRadius: 2, background: '#e5e7eb' }} />
              </div>
            );
          })}
        </div>
        <p className="muted" style={{ marginTop: '0.75rem' }}>
          Calendar view connects to your scheduled posts. Use the <b>Scheduled</b> page to create and manage future posts (including monthly recurrence).
        </p>
      </div>
    </div>
  );
}

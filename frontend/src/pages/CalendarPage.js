import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO
} from 'date-fns';
import styles from './CalendarPage.module.css';

const EVENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', startTime: '', endTime: '', allDay: false, color: '#3b82f6', type: 'PERSONAL' });
  const [filterMember, setFilterMember] = useState('all');

  useEffect(() => {
    fetchEvents();
    api.get(`/families/${user.familyId}/members`).then(r => setMembers(r.data));
  }, [user.familyId]);

  const fetchEvents = async () => {
    const { data } = await api.get('/events');
    setEvents(data);
  };

  const openNewEvent = (date) => {
    setEditingEvent(null);
    const dateStr = format(date, "yyyy-MM-dd'T'HH:mm");
    setForm({ title: '', description: '', startTime: dateStr, endTime: dateStr, allDay: false, color: '#3b82f6', type: 'PERSONAL' });
    setSelectedDate(date);
    setShowModal(true);
  };

  const openEditEvent = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description || '',
      startTime: event.startTime.slice(0, 16),
      endTime: event.endTime ? event.endTime.slice(0, 16) : event.startTime.slice(0, 16),
      allDay: event.allDay,
      color: event.color || '#3b82f6',
      type: event.type,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, form);
      } else {
        await api.post('/events', form);
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    await api.delete(`/events/${eventId}`);
    setShowModal(false);
    fetchEvents();
  };

  const getEventsForDay = (day) => {
    return events.filter(e => {
      const match = isSameDay(parseISO(e.startTime), day);
      if (filterMember !== 'all') return match && e.createdByUserId === filterMember;
      return match;
    });
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const d = day;
        const dayEvents = getEventsForDay(d);
        const isCurrentMonth = isSameMonth(d, currentDate);
        const isToday = isSameDay(d, new Date());

        week.push(
          <div
            key={d.toString()}
            className={`${styles.cell} ${!isCurrentMonth ? styles.otherMonth : ''} ${isToday ? styles.today : ''}`}
            onClick={() => openNewEvent(d)}
          >
            <span className={styles.dayNum}>{format(d, 'd')}</span>
            <div className={styles.cellEvents}>
              {dayEvents.slice(0, 3).map(ev => (
                <div
                  key={ev.id}
                  className={styles.eventChip}
                  style={{ background: ev.color || '#3b82f6' }}
                  onClick={(e) => openEditEvent(ev, e)}
                  title={ev.title}
                >
                  {ev.title}
                </div>
              ))}
              {dayEvents.length > 3 && <span className={styles.moreEvents}>+{dayEvents.length - 3} more</span>}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className={styles.week}>{week}</div>);
    }
    return rows;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.nav}>
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>‹</button>
          <h1>{format(currentDate, 'MMMM yyyy')}</h1>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>›</button>
        </div>
        <div className={styles.controls}>
          <select value={filterMember} onChange={e => setFilterMember(e.target.value)} className={styles.select}>
            <option value="all">All Members</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button className={styles.addBtn} onClick={() => openNewEvent(new Date())}>+ Add Event</button>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className={styles.weekDay}>{d}</div>
          ))}
        </div>
        {renderCalendar()}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingEvent ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <input className={styles.input} placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <textarea className={styles.textarea} placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Start</label>
                  <input type="datetime-local" className={styles.input} value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
                </div>
                <div className={styles.field}>
                  <label>End</label>
                  <input type="datetime-local" className={styles.input} value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Type</label>
                  <select className={styles.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="PERSONAL">Personal</option>
                    <option value="FAMILY">Family</option>
                    <option value="HOLIDAY">Holiday</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Color</label>
                  <div className={styles.colorPicker}>
                    {EVENT_COLORS.map(c => (
                      <button key={c} type="button" className={`${styles.colorDot} ${form.color === c ? styles.colorSelected : ''}`}
                        style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                {editingEvent && editingEvent.createdByUserId === user.userId && (
                  <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(editingEvent.id)}>Delete</button>
                )}
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [members, setMembers] = useState([]);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.familyId) { setLoading(false); return; }
    const fetchAll = async () => {
      try {
        const [eventsRes, todosRes, membersRes, familyRes] = await Promise.all([
          api.get('/events'),
          api.get('/todos'),
          api.get(`/families/${user.familyId}/members`),
          api.get(`/families/${user.familyId}`),
        ]);
        setEvents(eventsRes.data);
        setTodos(todosRes.data);
        setMembers(membersRes.data);
        setFamily(familyRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user?.familyId]);

  const upcomingEvents = events
    .filter(e => new Date(e.startTime) >= new Date())
    .slice(0, 5);

  const pendingTodos = todos.filter(t => !t.completed).slice(0, 5);

  const getDateLabel = (dateStr) => {
    const d = parseISO(dateStr);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM d');
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        {family && (
          <div className={styles.inviteBox}>
            <span>Invite Code:</span>
            <strong>{family.inviteCode}</strong>
          </div>
        )}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{members.length}</span>
          <span className={styles.statLabel}>Family Members</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{upcomingEvents.length}</span>
          <span className={styles.statLabel}>Upcoming Events</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{pendingTodos.length}</span>
          <span className={styles.statLabel}>Pending Tasks</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{todos.filter(t => t.completed).length}</span>
          <span className={styles.statLabel}>Completed Tasks</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>📅 Upcoming Events</h2>
            <Link to="/calendar">View all</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className={styles.empty}>No upcoming events. <Link to="/calendar">Add one!</Link></p>
          ) : (
            <ul className={styles.list}>
              {upcomingEvents.map(event => (
                <li key={event.id} className={styles.eventItem}>
                  <div className={styles.eventDot} style={{ background: event.color || '#3b82f6' }} />
                  <div>
                    <p className={styles.eventTitle}>{event.title}</p>
                    <p className={styles.eventMeta}>
                      {getDateLabel(event.startTime)} · {event.createdByUserName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>✅ Pending Tasks</h2>
            <Link to="/todos">View all</Link>
          </div>
          {pendingTodos.length === 0 ? (
            <p className={styles.empty}>All caught up! 🎉</p>
          ) : (
            <ul className={styles.list}>
              {pendingTodos.map(todo => (
                <li key={todo.id} className={styles.todoItem}>
                  <span className={`${styles.priority} ${styles[todo.priority?.toLowerCase()]}`}>
                    {todo.priority}
                  </span>
                  <div>
                    <p className={styles.todoTitle}>{todo.title}</p>
                    <p className={styles.todoMeta}>
                      {todo.assignedToUserName ? `Assigned to ${todo.assignedToUserName}` : `By ${todo.createdByUserName}`}
                      {todo.dueDate && ` · Due ${format(parseISO(todo.dueDate), 'MMM d')}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>👨‍👩‍👧‍👦 Family Members</h2>
          </div>
          <ul className={styles.memberList}>
            {members.map(member => (
              <li key={member.id} className={styles.memberItem}>
                <div className={styles.avatar} style={{ background: member.avatarColor }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={styles.memberName}>{member.name}</p>
                  <p className={styles.memberEmail}>{member.email}</p>
                </div>
                {member.id === user.userId && <span className={styles.youBadge}>You</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

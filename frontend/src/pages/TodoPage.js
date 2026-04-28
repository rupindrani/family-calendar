import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { format, parseISO } from 'date-fns';
import styles from './TodoPage.module.css';

export default function TodoPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assignedToUserId: '', assignedToUserName: '' });

  useEffect(() => {
    fetchTodos();
    api.get(`/families/${user.familyId}/members`).then(r => setMembers(r.data));
  }, [user.familyId]);

  const fetchTodos = async () => {
    const { data } = await api.get('/todos');
    setTodos(data);
  };

  const openNew = () => {
    setEditingTodo(null);
    setForm({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assignedToUserId: '', assignedToUserName: '' });
    setShowModal(true);
  };

  const openEdit = (todo) => {
    setEditingTodo(todo);
    setForm({
      title: todo.title,
      description: todo.description || '',
      dueDate: todo.dueDate || '',
      priority: todo.priority,
      assignedToUserId: todo.assignedToUserId || '',
      assignedToUserName: todo.assignedToUserName || '',
    });
    setShowModal(true);
  };

  const handleAssignChange = (e) => {
    const memberId = e.target.value;
    const member = members.find(m => m.id === memberId);
    setForm({ ...form, assignedToUserId: memberId, assignedToUserName: member ? member.name : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        await api.put(`/todos/${editingTodo.id}`, form);
      } else {
        await api.post('/todos', form);
      }
      setShowModal(false);
      fetchTodos();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving task');
    }
  };

  const handleToggle = async (todoId) => {
    await api.patch(`/todos/${todoId}/toggle`);
    fetchTodos();
  };

  const handleDelete = async (todoId) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/todos/${todoId}`);
    fetchTodos();
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'mine') return t.assignedToUserId === user.userId || t.createdByUserId === user.userId;
    return true;
  });

  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const sorted = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>✅ Family To-Do List</h1>
        <button className={styles.addBtn} onClick={openNew}>+ Add Task</button>
      </div>

      <div className={styles.filters}>
        {['all', 'pending', 'completed', 'mine'].map(f => (
          <button key={f} className={filter === f ? `${styles.filterBtn} ${styles.filterActive}` : styles.filterBtn} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className={styles.count}>{filteredTodos.length} tasks</span>
      </div>

      <div className={styles.list}>
        {sorted.length === 0 ? (
          <div className={styles.empty}>No tasks here. Add one!</div>
        ) : (
          sorted.map(todo => (
            <div key={todo.id} className={`${styles.todoCard} ${todo.completed ? styles.completed : ''}`}>
              <button className={styles.checkbox} onClick={(e) => { e.stopPropagation(); handleToggle(todo.id); }}>
                {todo.completed ? '✅' : '⬜'}
              </button>
              <div className={styles.todoContent} onClick={() => openEdit(todo)}>
                <div className={styles.todoTop}>
                  <span className={styles.todoTitle}>{todo.title}</span>
                  <span className={`${styles.badge} ${styles[todo.priority?.toLowerCase()]}`}>{todo.priority}</span>
                </div>
                {todo.description && <p className={styles.todoDesc}>{todo.description}</p>}
                <div className={styles.todoMeta}>
                  <span>By {todo.createdByUserName}</span>
                  {todo.assignedToUserName && <span>→ {todo.assignedToUserName}</span>}
                  {todo.dueDate && <span>📅 {format(parseISO(todo.dueDate), 'MMM d, yyyy')}</span>}
                  {todo.completed && todo.completedAt && <span>✓ {format(parseISO(todo.completedAt), 'MMM d')}</span>}
                </div>
              </div>
              {todo.createdByUserId === user.userId && (
                <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); handleDelete(todo.id); }}>🗑</button>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingTodo ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <input className={styles.input} placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <textarea className={styles.textarea} placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Priority</label>
                  <select className={styles.input} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Due Date</label>
                  <input type="date" className={styles.input} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <div className={styles.field}>
                <label>Assign To</label>
                <select className={styles.input} value={form.assignedToUserId} onChange={handleAssignChange}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className={styles.modalActions}>
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

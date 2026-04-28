import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>🏠</span>
          <span>FamilyCal</span>
        </div>

        <div className={styles.familyInfo}>
          <p className={styles.familyName}>{user?.familyName}</p>
          <p className={styles.userName}>{user?.name}</p>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            📅 Calendar
          </NavLink>
          <NavLink to="/todos" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            ✅ To-Do List
          </NavLink>
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

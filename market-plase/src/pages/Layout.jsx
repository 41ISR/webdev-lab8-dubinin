import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

export default function Layout() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.logo}>🛒 Маркетплейс</Link>
          
          <ul style={styles.navLinks}>
            <li><Link to="/" style={styles.navLink}>Товары</Link></li>
            {user ? (
              <>
                <li><Link to="/my-bids" style={styles.navLink}>Мои ставки</Link></li>
                <li><Link to="/create-item" style={styles.btnPrimary}>+ Создать товар</Link></li>
                <li style={styles.userInfo}>
                  <span style={styles.username}>{user.username}</span>
                  <button onClick={handleLogout} style={styles.btnLogout}>Выйти</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" style={styles.navLink}>Войти</Link></li>
                <li><Link to="/register" style={styles.btnPrimary}>Регистрация</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2025 Маркетплейс. Все права защищены.</p>
      </footer>
    </>
  );
}

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  nav: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    listStyle: 'none',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  btnPrimary: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  btnLogout: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  username: {
    fontWeight: '500',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 20px',
    minHeight: 'calc(100vh - 128px)',
  },
  footer: {
    backgroundColor: '#34495e',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
  },
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services';
import { useUserStore } from '../store/useUserStore';

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.username.length < 3) {
      setError('Имя пользователя должно быть не менее 3 символов');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      setUser(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>👤</div>
        <h1 style={styles.title}>Регистрация</h1>
        <p style={styles.subtitle}>Создайте новый аккаунт</p>
      </div>

      {error && (
        <div style={styles.alertError}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Имя пользователя</label>
          <input
            type="text"
            style={styles.input}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Введите имя пользователя"
            minLength="3"
            required
          />
          <div style={styles.hint}>Минимум 3 символа</div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email <span style={styles.optional}>(необязательно)</span></label>
          <input
            type="email"
            style={styles.input}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@email.com"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Пароль</label>
          <input
            type="password"
            style={styles.input}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Введите пароль"
            minLength="6"
            required
          />
          <div style={styles.hint}>Минимум 6 символов</div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Подтверждение пароля</label>
          <input
            type="password"
            style={styles.input}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Повторите пароль"
            required
          />
        </div>

        <button type="submit" style={styles.btnSubmit} disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div style={styles.divider}>или</div>

      <div style={styles.link}>
        Уже есть аккаунт? <a href="/login" style={styles.linkA}>Войти</a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '450px',
    margin: '80px auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  alertError: {
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
    fontSize: '14px',
  },
  optional: {
    color: '#95a5a6',
    fontWeight: '400',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  hint: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '6px',
  },
  btnSubmit: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  divider: {
    textAlign: 'center',
    margin: '24px 0',
    color: '#7f8c8d',
    fontSize: '14px',
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#7f8c8d',
    fontSize: '14px',
  },
  linkA: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

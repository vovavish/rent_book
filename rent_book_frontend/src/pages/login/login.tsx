import { SyntheticEvent, useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { Link } from 'react-router-dom';
import styles from './login.module.scss';
import bookAndFlowers from '/kniga-i-cvety-pod-vysokim-uglom.jpg';
import { UserActionButton } from '../../components/ui';

export const LoginPage = () => {
  const { authStore } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authStore.signIn(email, password);
    } catch {
      setError('Неверная почта или пароль');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContent}>
          <h2 className={styles.title}>Вход</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label htmlFor="email">Почта</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите почту"
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>

            <div className={styles.buttonWrapper}>
              <UserActionButton type="submit" variant="reader" className={styles.button}>
                Войти
              </UserActionButton>
            </div>
            <p className={styles.footerAttention}>
              При входе вы соглашаетесь с{' '}
              <Link to="/terms" className={styles.link}>
                условиями использования
              </Link>{' '}
              и{' '}
              <Link to="/privacy" className={styles.link}>
                политикой конфиденциальности
              </Link>
            </p>
          </form>

          <p className={styles.footerText}>
            Еще нет аккаунта?
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <img src={bookAndFlowers} alt="Книга и цветы" className={styles.image} />
      </div>
    </div>
  );
};

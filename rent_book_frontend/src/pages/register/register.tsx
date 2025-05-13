import { SyntheticEvent, useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { Link } from 'react-router-dom';
import bookAndFlowers from '/cvetocnyi-press-s-knigami-vid-sverhu.jpg';
import styles from './register.module.scss';
import { UserActionButton } from '../../components/ui';
import { ConfirmModal } from '../../components/modal/modal-confirm';

export const RegisterPage = () => {
  const { authStore } = useStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    setIsModalOpen(true);

    setError(null);
    try {
      await authStore.signUp(email, name, lastname, surname, password);
    } catch (err) {
      setError('Пользователь с данной почтой уже зарегистрирован');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <ConfirmModal
          onCancel={() => setIsModalOpen(false)}
          message="Данная площадка является демонстрационным проектом и предназначена исключительно для ознакомления. Администрация не несет ответственности за любые возможные убытки, неточности или последствия, связанные с использованием этого сервиса."
          onConfirm={handleSubmit}
        />
      )}
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img src={bookAndFlowers} alt="Книга и цветы" className={styles.image} />
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.formContent}>
            <h2 className={styles.title}>Регистрация</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              <div className={styles.formField}>
                <label htmlFor="name">Имя</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите имя"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="lastname">Фамилия</label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Введите фамилию"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="surname">Отчество</label>
                <input
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Введите отчество"
                  required
                />
              </div>

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
                <UserActionButton type="submit" className={styles.button}>
                  Зарегистрироваться
                </UserActionButton>
              </div>
              <p className={styles.footerAttention}>
                При регистрации и входе вы соглашаетесь с{' '}
                <Link to="/terms" className={styles.link}>
                  условиями использования
                </Link>{' '}
                и{' '}
                <Link to="/policy" className={styles.link}>
                  политикой конфиденциальности
                </Link>
              </p>
            </form>

            <p className={styles.footerText}>
              Уже зарегистрированы?
              <Link to="/login" className={styles.link}>
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

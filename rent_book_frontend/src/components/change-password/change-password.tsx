import { useState } from 'react';
import styles from './change-password.module.scss';
import { UserActionButton } from '../ui';

interface ChangePasswordProps {
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Новый пароль и его подтверждение не совпадают!');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(oldPassword, newPassword);
    } catch (err) {
      console.error('Ошибка смены пароля:', err);
      setError('Не удалось сменить пароль. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles['change-password-form']} onSubmit={handleSubmit}>
      <div className={styles['form-group']}>
        <label htmlFor="oldPassword">Старый пароль:</label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="newPassword">Новый пароль:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <UserActionButton type="submit" disabled={isSubmitting} variant="reader">
        {isSubmitting ? 'Сохранение...' : 'Сменить пароль'}
      </UserActionButton>
    </form>
  );
};

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import { Modal } from '../../../components/modal/modal';

import styles from './new-ticket.module.scss';
import { DashboardTitle } from '../../../components/ui/dashboard-title';
import { UserActionButton } from '../../../components/ui';

export const NewTicket = observer(() => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Новое состояние для модального окна

  const { supportRequestStore } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Заголовок и описание обязательны для заполнения');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await supportRequestStore.createRequest({
        title,
        content,
      });
      setIsModalOpen(true); // Открываем модальное окно после успешной отправки
    } catch (err) {
      setError('Не удалось создать обращение. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className={styles.container}>
      <DashboardTitle>Создание нового обращения</DashboardTitle>
      
      {error && <div className={styles.error}>{error}</div>}
      {supportRequestStore.error && (
        <div className={styles.error}>{supportRequestStore.error}</div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Заголовок обращения (*)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            placeholder="Кратко опишите проблему"
            disabled={isSubmitting || supportRequestStore.isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            Текст обращения (*)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            placeholder="Подробно опишите вашу проблему или вопрос"
            rows={8}
            disabled={isSubmitting || supportRequestStore.isLoading}
          />
        </div>

        <div className={styles.actions}>
          <UserActionButton
            type="submit"
            disabled={isSubmitting || supportRequestStore.isLoading}
            variant="reader"
          >
            {isSubmitting || supportRequestStore.isLoading ? 'Отправка...' : 'Отправить'}
          </UserActionButton>
        </div>
      </form>

      {isModalOpen && (
        <Modal message="Обращение отправлено!" onClose={closeModal} />
      )}
    </div>
  );
});

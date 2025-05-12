import { useEffect } from 'react';
import { useStore } from '../../../hooks/useStore';
import { Preloader, UserActionButton } from '../../../components/ui';
import { BookComplainTranslations } from '../../../types/complain/complain';
import { Link } from 'react-router-dom';
import { EmptyText } from '../../../components/empty-text/empty-text';

import dayjs from 'dayjs';

import styles from './admin-book-complaints.module.scss';
import { observer } from 'mobx-react-lite';

export const AdminBookComplains = observer(() => {
  const { supportRequestStore } = useStore();

  useEffect(() => {
    supportRequestStore.fetchComplains();
  }, []);

  if (supportRequestStore.isLoading) {
    return <Preloader />;
  }

  console.log('supportRequestStore.complains', supportRequestStore.complains);

  return (
    <div className={styles.container}>
      {supportRequestStore.complains.length ? (
        supportRequestStore.complains.map((complain) => (
          <div key={complain.id} className={styles.complainCard}>
            <div className={styles.complainTitle}>
              Тип жалобы: {BookComplainTranslations[complain.reason]}
            </div>
            <p className={styles.userInfo}>
              От: {complain.user.lastname} {complain.user.name} {complain.user.surname},{' '}
              {dayjs(complain.createdAt).format('DD.MM.YYYY HH:mm')}
            </p>
            {complain.message && (
              <div className={styles.complainMessage}>Сообщение: {complain.message}</div>
            )}
            <Link to={`/rent_book/${complain.book.id}`}>
              <UserActionButton variant="admin">Просмотреть издание</UserActionButton>
            </Link>
          </div>
        ))
      ) : (
        <EmptyText>Жалоб нет</EmptyText>
      )}
    </div>
  );
});

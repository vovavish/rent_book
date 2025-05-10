import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateRentalDto } from '../../types/response/rentalResonse';

import styles from './start-rent-book.module.scss';
import { UserActionButton } from '../ui';

export const StartRentBookPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [rentalData, setRentalData] = useState<Partial<CreateRentalDto>>({
    bookId: bookId ? Number(bookId) : undefined,
    rentStartDate: new Date().toISOString().split('T')[0],
    rentEndDate: defaultEndDate.toISOString().split('T')[0],
    message: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);

  const book = rentBookStore.currentBook;
  const isOwner = authStore.isAuth && book?.user.id === authStore.user?.id;

  useEffect(() => {
    if (book && rentalData.rentStartDate && rentalData.rentEndDate) {
      calculateTotalPrice();
    }
  }, [rentalData.rentStartDate, rentalData.rentEndDate, book]);

  const calculateTotalPrice = () => {
    if (!book || !rentalData.rentStartDate || !rentalData.rentEndDate) return;

    const startDate = new Date(rentalData.rentStartDate);
    const endDate = new Date(rentalData.rentEndDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const rentalCost = days * book.price;
    setTotalPrice(book.deposit + rentalCost);
  };

  const handleRentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authStore.isAuth) {
      navigate('/login');
      return;
    }

    if (isOwner) {
      alert('Вы не можете арендовать свою собственную книгу');
      return;
    }

    if (rentalData.rentStartDate && rentalData.rentEndDate) {
      const startDate = new Date(rentalData.rentStartDate);
      const endDate = new Date(rentalData.rentEndDate);
      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + (book?.minDaysToRent || 0));

      if (endDate < minEndDate) {
        alert(`Дата окончания аренды должна быть не раньше ${minEndDate.toLocaleDateString()}`);
        return;
      }
    }

    try {
      const rentalRequest: CreateRentalDto = {
        bookId: Number(bookId),
        rentStartDate: rentalData.rentStartDate!,
        rentEndDate: rentalData.rentEndDate!,
        message: rentalData.message!,
      };
      await rentBookStore.requestRental(rentalRequest);
      navigate('/dashboard/my_rents');
    } catch (error) {
      console.error('Error requesting rental:', error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newRentalData = { ...rentalData, [id]: value };

    if (id === 'rentStartDate' && book && newRentalData.rentEndDate) {
      const startDate = new Date(value);
      const endDate = new Date(newRentalData.rentEndDate);
      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + book.minDaysToRent);

      if (endDate < minEndDate) {
        newRentalData.rentEndDate = minEndDate.toISOString().split('T')[0];
      }
    }

    setRentalData(newRentalData);
  };

  const getMinEndDate = () => {
    if (!rentalData.rentStartDate || !book) {
      return rentalData.rentStartDate || new Date().toISOString().split('T')[0];
    }

    try {
      const startDate = new Date(rentalData.rentStartDate);

      if (isNaN(startDate.getTime())) {
        return new Date().toISOString().split('T')[0];
      }

      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + book.minDaysToRent);

      if (isNaN(minEndDate.getTime())) {
        return new Date().toISOString().split('T')[0];
      }

      return minEndDate.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error calculating minEndDate:', error);
      return new Date().toISOString().split('T')[0];
    }
  };

  if (!bookId) {
    return <p>Книга не найдена</p>;
  }

  console.log('book', book);

  return (
    <div className={styles['start-rent-book-page']}>
      {rentBookStore.isLoading && <p>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      {book ? (
        <div className={styles['rent-form-container']}>
          {isOwner ? (
            <p className={styles.ownerMessage}>Вы не можете арендовать свою собственную книгу</p>
          ) : book.availabilityStatus === 'ACTIVE' ? (
            <form onSubmit={handleRentRequest} className={styles['rent-form']}>
              <div className={styles.formTitleInfo}>
                {book.author}, {book.title}. {book.frequencyTitle && `${book.frequencyTitle}`}
              </div>
              <div>
                <div className={styles.ownerData}>
                  Владелец: {book.user.lastname} {book.user.name} {book.user.surname}
                </div>
                <h2 className={styles.orderTitle}>Детали заказа</h2>
                <div className={styles['form-group']}>
                  <label htmlFor="rentStartDate">Дата начала аренды:</label>
                  <input
                    type="date"
                    id="rentStartDate"
                    value={rentalData.rentStartDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    placeholder="дд.мм.гггг"
                    required
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="rentEndDate">Дата окончания аренды:</label>
                <input
                  type="date"
                  id="rentEndDate"
                  value={rentalData.rentEndDate}
                  min={getMinEndDate()}
                  onChange={handleDateChange}
                  required
                />
                {book.minDaysToRent > 0 && (
                  <p className={styles.minDaysInfo}>
                    Минимальный срок аренды: {book.minDaysToRent} дней
                  </p>
                )}
                <div className={styles.message}>
                  <label>
                    Напишите сообщение владельцу! Опишите почему вы хотите арендовать именно эту
                    книгу:
                  </label>
                  <textarea
                    id="message"
                    value={rentalData.message}
                    onChange={(e) => setRentalData({ ...rentalData, message: e.target.value })}
                    placeholder="Введите текст..."
                    className={styles.textarea}
                  />
                </div>
                <div className={styles['price-calculation']}>
                  <p><span className={styles.accentText}>Депозит:</span> {book.deposit} рублей</p>
                  <p><span className={styles.accentText}>Арендная плата:</span> {(totalPrice - book.deposit).toFixed(2)} рублей</p>
                  <p className={styles.totalPrice}>
                    <span className={styles.uppercase}>Итого:</span>
                    <span>{totalPrice.toFixed(2)} рублей</span>
                  </p>
                </div>
              </div>
              <UserActionButton type="submit" disabled={rentBookStore.isLoading} variant="reader">
                {rentBookStore.isLoading ? 'Отправка...' : 'Запросить аренду'}
              </UserActionButton>
            </form>
          ) : (
            <p className={styles.unavailableMessage}>Эта книга сейчас недоступна для аренды</p>
          )}
        </div>
      ) : (
        !rentBookStore.isLoading && <p>Книга не найдена</p>
      )}
    </div>
  );
});

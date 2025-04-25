// pages/start-rent-book.tsx
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateRentalDto } from '../../types/response/rentalResonse';
import styles from './start-rent-book.module.scss';

export const StartRentBookPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [rentalData, setRentalData] = useState<Partial<CreateRentalDto>>({
    bookId: bookId ? Number(bookId) : undefined,
    rentStartDate: new Date().toISOString().split('T')[0],
    rentEndDate: defaultEndDate.toISOString().split('T')[0],
  });

  const [totalPrice, setTotalPrice] = useState(0);

  const book = rentBookStore.currentBook;
  const isOwner = authStore.isAuth && book?.user.id === authStore.user?.id;

  useEffect(() => {
    const fetchBooks = async () => {
      if (bookId) {
        await rentBookStore.fetchToRentalBookById(Number(bookId));
        setRentalData((prev) => ({
          ...prev,
          bookId: Number(bookId),
          rentEndDate: rentBookStore.currentBook?.minDaysToRent
            ? new Date(Date.now() + rentBookStore.currentBook.minDaysToRent * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0]
            : prev.rentEndDate,
        }));
      }
    };

    fetchBooks();
  }, [bookId]);

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

  const nextImage = () => {
    if (book?.coverImagesUrls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % book.coverImagesUrls.length);
    }
  };

  const prevImage = () => {
    if (book?.coverImagesUrls) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + book.coverImagesUrls.length) % book.coverImagesUrls.length,
      );
    }
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

    // Дополнительная проверка дат
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

    // Если меняется дата начала, проверяем дату окончания
    if (id === 'rentStartDate' && book && newRentalData.rentEndDate) {
      const startDate = new Date(value);
      const endDate = new Date(newRentalData.rentEndDate);
      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + book.minDaysToRent);

      // Если текущая дата окончания раньше новой минимальной даты
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
      <h1>Запрос аренды книги</h1>

      {rentBookStore.isLoading && <p>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      {book ? (
        <div className={styles['rent-form-container']}>
          <div className={styles['book-details']}>
            <div className={styles['image-slider']}>
              {book.coverImagesUrls?.length > 0 && (
                <>
                  <div className={styles['image-container']}>
                    <img
                      src={book.coverImagesUrls[currentImageIndex]}
                      alt={`${book.title} ${currentImageIndex + 1}`}
                    />
                  </div>
                  {book.coverImagesUrls.length > 1 && (
                    <div className={styles['slider-controls']}>
                      <button onClick={prevImage} className={styles['slider-button']}>
                        &lt;
                      </button>
                      <span className={styles['slider-counter']}>
                        {currentImageIndex + 1}/{book.coverImagesUrls.length}
                      </span>
                      <button onClick={nextImage} className={styles['slider-button']}>
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={styles['book-info']}>
              <h2>{book.title}</h2>
              <p>Автор: {book.author}</p>
              <p>Состояние: {book.condition}</p>
              <p>Год издания: {book.publishedYear}</p>
              <p>ISBN: {book.isbn}</p>
              <p>Язык: {book.language}</p>
              <p>Категория: {book.category}</p>
              <p>Цена за день: {book.price} рублей</p>
              <p>Депозит: {book.deposit} рублей</p>
              <p>Минимальный срок аренды: {book.minDaysToRent} дней</p>
              <p>Владелец: {`${book.user.name} ${book.user.lastname} ${book.user.surname}`}</p>
              <p>Статус: {book.availabilityStatus}</p>
            </div>
          </div>

          {isOwner ? (
            <p className={styles.ownerMessage}>Вы не можете арендовать свою собственную книгу</p>
          ) : book.availabilityStatus === 'ACTIVE' ? (
            <form onSubmit={handleRentRequest} className={styles['rent-form']}>
              <div className={styles['form-group']}>
                <label htmlFor="rentStartDate">Дата начала аренды:</label>
                <input
                  type="date"
                  id="rentStartDate"
                  value={rentalData.rentStartDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  required
                />
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
              </div>
              <div className={styles['price-calculation']}>
                <h3>Стоимость аренды:</h3>
                <p>Депозит: {book.deposit} рублей</p>
                <p>Стоимость аренды: {(totalPrice - book.deposit).toFixed(2)} рублей</p>
                <p className={styles.totalPrice}>Итого: {totalPrice.toFixed(2)} рублей</p>
              </div>
              <button
                type="submit"
                disabled={rentBookStore.isLoading}
                className={styles['submit-button']}
              >
                {rentBookStore.isLoading ? 'Отправка...' : 'Запросить аренду'}
              </button>
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

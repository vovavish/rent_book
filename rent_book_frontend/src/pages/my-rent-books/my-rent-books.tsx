import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState, useRef } from 'react';
import { CreateBookDto, Condition, Format, BookStatus } from '../../types/response/bookResponse';
import './my-rent-books.css';
import { MyRentBookList } from '../../components/book/my-rent-books/my-rent-book-list';
import { DashboardTitle } from '../../components/ui/dashboard-title';

export const MyRentBooksPage = observer(() => {
  const { rentBookStore, userProfileStore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newBook, setNewBook] = useState<Partial<CreateBookDto>>({
    condition: Condition.NEW,
    format: Format.PAPERBACK,
    availabilityStatus: BookStatus.ACTIVE,
    deposit: 0,
    minDaysToRent: 1,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    rentBookStore.fetchUserBooks();
    userProfileStore.fetchProfile();
  }, []);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('coverImages', file));
      formData.append(
        'data',
        JSON.stringify({
          ...newBook,
          cardNumber: selectedCard,
        }),
      );
      await rentBookStore.createBook(formData);
      closeModal();
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const profile = userProfileStore.profile;
      if (
        !profile?.name ||
        !profile?.lastname ||
        !profile?.email ||
        !profile?.phoneNumbers.length
      ) {
        alert(
          'Пожалуйста, заполните все обязательные данные в личном кабинете (Имя, Фамилия, Email, Телефон)',
        );
        return;
      }
    }
    if (currentStep === 2 && !selectedCard) {
      alert('Пожалуйста, выберите карту');
      return;
    }
    if (
      currentStep === 3 &&
      (!newBook.title ||
        !newBook.author ||
        !newBook.isbn ||
        !newBook.publishedYear ||
        !newBook.language ||
        !newBook.category ||
        !newBook.description ||
        !newBook.condition ||
        !newBook.price ||
        !selectedFiles.length)
    ) {
      alert('Пожалуйста, заполните обязательные поля (*)');
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setNewBook({
      condition: Condition.NEW,
      format: Format.PAPERBACK,
      availabilityStatus: BookStatus.ACTIVE,
      deposit: 0,
      minDaysToRent: 1,
    });
    setSelectedFiles([]);
    setSelectedCard('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderStep = () => {
    const profile = userProfileStore.profile;

    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Шаг 1: Информация о владельце</h3>
            <div className="owner-info">
              <p>
                <strong>Имя:</strong> {profile?.name || 'Не указано'}
              </p>
              <p>
                <strong>Фамилия:</strong> {profile?.lastname || 'Не указано'}
              </p>
              <p>
                <strong>Отчество:</strong> {profile?.surname || 'Не указано'}
              </p>
              <p>
                <strong>Email:</strong> {profile?.email || 'Не указано'}
              </p>
              <p>
                <strong>Телефон:</strong> {profile?.phoneNumbers[0] || 'Не указано'}
              </p>
            </div>

            {(!profile?.name ||
              !profile?.lastname ||
              !profile?.email ||
              !profile?.phoneNumbers.length) && (
              <div className="warning">
                Пожалуйста, заполните недостающие данные в вашем профиле перед добавлением книги.
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Шаг 2: Выбор карты</h3>
            <div className="cards-list">
              {userProfileStore.profile?.cardNumbers?.length! > 0 ? (
                userProfileStore.profile?.cardNumbers.map((card, index) => (
                  <div
                    key={index}
                    className={`card-item ${selectedCard === card ? 'selected' : ''}`}
                    onClick={() => setSelectedCard(card)}
                  >
                    **** **** **** {card.slice(-4)}
                  </div>
                ))
              ) : (
                <p>У вас нет сохраненных карт. Пожалуйста, добавьте карту в профиле.</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Шаг 3: Информация о книге</h3>
            <div className="book-form-grid">
              <div className="form-group">
                <label>Название*</label>
                <input
                  type="text"
                  value={newBook.title || ''}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Автор*</label>
                <input
                  type="text"
                  value={newBook.author || ''}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>ISBN*</label>
                <input
                  type="text"
                  value={newBook.isbn || ''}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Год издания*</label>
                <input
                  type="number"
                  value={newBook.publishedYear || ''}
                  onChange={(e) =>
                    setNewBook({ ...newBook, publishedYear: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Язык*</label>
                <input
                  type="text"
                  value={newBook.language || ''}
                  onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Категория*</label>
                <input
                  type="text"
                  value={newBook.category || ''}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание*</label>
                <textarea
                  value={newBook.description || ''}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Состояние*</label>
                <select
                  value={newBook.condition}
                  onChange={(e) =>
                    setNewBook({ ...newBook, condition: e.target.value as Condition })
                  }
                >
                  {Object.values(Condition).map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Цена аренды (руб/день)*</label>
                <input
                  type="number"
                  value={newBook.price || ''}
                  onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Формат</label>
                <select
                  value={newBook.format || Format.PAPERBACK}
                  onChange={(e) => setNewBook({ ...newBook, format: e.target.value as Format })}
                >
                  {Object.values(Format).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Издательство</label>
                <input
                  type="text"
                  value={newBook.publisher || ''}
                  onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Серия</label>
                <input
                  type="text"
                  value={newBook.series || ''}
                  onChange={(e) => setNewBook({ ...newBook, series: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Издание</label>
                <input
                  type="text"
                  value={newBook.edition || ''}
                  onChange={(e) => setNewBook({ ...newBook, edition: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Количество страниц</label>
                <input
                  type="number"
                  value={newBook.pages || ''}
                  onChange={(e) => setNewBook({ ...newBook, pages: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Изображения книги*</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  required
                />
                {selectedFiles.length > 0 && (
                  <div className="selected-files">
                    <p>Выбранные файлы:</p>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Шаг 4: Условия аренды</h3>
            <div className="rent-conditions">
              <div className="form-group">
                <label>Минимальный срок аренды (дни)*</label>
                <input
                  type="number"
                  min="1"
                  value={newBook.minDaysToRent || 1}
                  onChange={(e) =>
                    setNewBook({ ...newBook, minDaysToRent: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Залог (руб)</label>
                <input
                  type="number"
                  min="0"
                  value={newBook.deposit || 0}
                  onChange={(e) => setNewBook({ ...newBook, deposit: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Шаг 5: Подтверждение</h3>
            <div className="confirmation">
              <h4>Информация о владельце:</h4>
              <p>
                {userProfileStore.profile?.lastname} {userProfileStore.profile?.name}{' '}
                {userProfileStore.profile?.surname}
              </p>
              <p>Email: {userProfileStore.profile?.email}</p>
              <p>Телефон: {userProfileStore.profile?.phoneNumbers[0]}</p>

              <h4>Карта:</h4>
              <p>**** **** **** {selectedCard.slice(-4)}</p>

              <h4>Информация о книге:</h4>
              <p>Название: {newBook.title}</p>
              <p>Автор: {newBook.author}</p>
              <p>ISBN: {newBook.isbn}</p>
              <p>Год издания: {newBook.publishedYear}</p>
              <p>Состояние: {newBook.condition}</p>
              <p>Цена аренды: {newBook.price} руб.</p>

              <h4>Условия аренды:</h4>
              <p>Минимальный срок: {newBook.minDaysToRent} дней</p>
              <p>Залог: {newBook.deposit || 0} руб.</p>

              <h4>Изображения:</h4>
              <div className="preview-images">
                {selectedFiles.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="preview-image"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-rent-books">
      <div className="header">
        <DashboardTitle>Мои объявления</DashboardTitle>
        <button onClick={() => setIsModalOpen(true)} className='header__add-button'>+ разместить объявление</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>Добавление книги</h2>
              <div className="steps-indicator">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`step ${currentStep === step ? 'active' : ''} ${
                      currentStep > step ? 'completed' : ''
                    }`}
                    onClick={() => currentStep > step && setCurrentStep(step)}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <form className="create-book-form" encType="multipart/form-data">
              {renderStep()}

              <div className="modal-footer">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="secondary-button">
                    Назад
                  </button>
                )}

                {currentStep < 5 ? (
                  <button type="button" onClick={nextStep} className="primary-button">
                    Далее
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={rentBookStore.isLoading}
                    className="primary-button"
                    onClick={handleCreateBook}
                  >
                    {rentBookStore.isLoading ? 'Создание...' : 'Создать книгу'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {rentBookStore.isLoading && !isModalOpen && <p>Загрузка...</p>}
      {rentBookStore.error && <p className="error">{rentBookStore.error}</p>}

      {rentBookStore.books.length > 0
        ? <MyRentBookList books={rentBookStore.books} currentImageIndices={currentImageIndices} setCurrentImageIndices={setCurrentImageIndices}/>
        : !rentBookStore.isLoading && <p>У вас пока нет книг</p>}
    </div>
  );
});

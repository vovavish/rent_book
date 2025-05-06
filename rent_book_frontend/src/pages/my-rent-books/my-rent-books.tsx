import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState, useRef } from 'react';
import {
  CreateBookDto,
  Condition,
  Format,
  BookStatus,
  Type,
  Category,
  AgeRating,
  Periodicity,
  MaterialConstruction,
} from '../../types/response/bookResponse';
import styles from './my-rent-books.module.scss';
import { MyRentBookList } from '../../components/book/my-rent-books/my-rent-book-list';
import { DashboardTitle } from '../../components/ui/dashboard-title';
import { AddressPicker } from '../../components/address-picker/address-picker';
import Select from 'react-select';

type Option = {
  value: Category;
  label: string;
};

export const MyRentBooksPage = observer(() => {
  const { rentBookStore, userProfileStore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newBook, setNewBook] = useState<Partial<CreateBookDto>>({
    condition: Condition.NEW_EDITION,
    format: Format.SMALL_FORMAT,
    availabilityStatus: BookStatus.ACTIVE,
    deposit: 0,
    minDaysToRent: 1,
    type: Type.BOOK,
    category: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  const stepTitles = [
    'Контактная информация',
    'Средство получения оплаты',
    'Информация об издании',
    'Условия аренды',
    'Проверка введенных данных',
  ];

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
        !newBook.category?.length ||
        !newBook.description ||
        !newBook.condition ||
        !newBook.type ||
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
      condition: Condition.NEW_EDITION,
      format: Format.SMALL_FORMAT,
      availabilityStatus: BookStatus.ACTIVE,
      deposit: 0,
      minDaysToRent: 1,
      type: Type.BOOK,
      category: [],
    });
    setSelectedFiles([]);
    setSelectedCard('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddressSelect = ({
    address,
    lat,
    lon,
  }: {
    address: string;
    lat: number;
    lon: number;
  }) => {
    setNewBook((prev) => ({ ...prev, address, lat, lon }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categories = e.target.value.split(',').map((cat) => cat.trim() as Category);
    setNewBook((prev) => ({ ...prev, category: categories }));
  };

  const categoryOptions: Option[] = Object.values(Category).map((cat) => ({
    value: cat,
    label: cat,
  }));

  const renderStep = () => {
    const profile = userProfileStore.profile;

    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.ownerInfo}>
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
              <div className={styles.warning}>
                Пожалуйста, заполните недостающие данные в вашем профиле перед добавлением книги.
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.cardsList}>
              {userProfileStore.profile?.cardNumbers?.length! > 0 ? (
                userProfileStore.profile?.cardNumbers.map((card, index) => (
                  <div
                    key={index}
                    className={`${styles.cardItem} ${selectedCard === card ? styles.selected : ''}`}
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
          <div className={styles.stepContent}>
            <div className={styles.bookFormGrid}>
              <h3>Основная информация:</h3>
              <div className={styles.formGroupWrapper}>
                <div className={styles.formGroup}>
                  <label>Автор:*</label>
                  <input
                    type="text"
                    value={newBook.author || ''}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Название:*</label>
                  <input
                    type="text"
                    value={newBook.title || ''}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Частное название:</label>
                  <input
                    type="text"
                    value={newBook.frequencyTitle || ''}
                    onChange={(e) => setNewBook({ ...newBook, frequencyTitle: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Город издательства:*</label>
                  <input
                    type="text"
                    value={newBook.publishingCity || ''}
                    onChange={(e) => setNewBook({ ...newBook, publishingCity: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Издательство:*</label>
                  <input
                    type="text"
                    value={newBook.publisher || ''}
                    onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Год издания:*</label>
                  <input
                    type="number"
                    value={newBook.publishedYear || ''}
                    onChange={(e) =>
                      setNewBook({ ...newBook, publishedYear: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Количество страниц:*</label>
                  <input
                    type="number"
                    value={newBook.pages || ''}
                    onChange={(e) => setNewBook({ ...newBook, pages: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Выберите тип издания*</label>
                <select
                  value={newBook.type}
                  onChange={(e) => setNewBook({ ...newBook, type: e.target.value as Type })}
                >
                  {Object.values(Type).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
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
              <div className={styles.formGroup}>
                <label>Возрастное ограничение:*</label>
                <select
                  value={newBook.ageRestriction}
                  onChange={(e) =>
                    setNewBook({ ...newBook, ageRestriction: e.target.value as AgeRating })
                  }
                >
                  {Object.values(AgeRating).map((ageRating) => (
                    <option key={ageRating} value={ageRating}>
                      {ageRating}
                    </option>
                  ))}
                </select>
              </div>
              <h3>Прочее:</h3>
              <div className={styles.formGroupWrapper}>
                <div className={styles.formGroup}>
                  <label>Переодичность издания:</label>
                  <select
                    value={newBook.periodicity}
                    onChange={(e) =>
                      setNewBook({ ...newBook, periodicity: e.target.value as Periodicity })
                    }
                  >
                    {Object.values(Periodicity).map((periodicity) => (
                      <option key={periodicity} value={periodicity}>
                        {periodicity}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Материальная конструкция:</label>
                  <select
                    value={newBook.periodicity}
                    onChange={(e) =>
                      setNewBook({
                        ...newBook,
                        materialConstruction: e.target.value as MaterialConstruction,
                      })
                    }
                  >
                    {Object.values(MaterialConstruction).map((materialConstruction) => (
                      <option key={materialConstruction} value={materialConstruction}>
                        {materialConstruction}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Формат:</label>
                  <select
                    value={newBook.periodicity}
                    onChange={(e) => setNewBook({ ...newBook, format: e.target.value as Format })}
                  >
                    {Object.values(Format).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Жанры:</label>
                  <Select
                    isMulti
                    className={styles.select}
                    options={categoryOptions}
                    onChange={(e: any) =>
                      setNewBook({ ...newBook, category: e.map((item: any) => item.value) })
                    }
                    value={categoryOptions.filter((option) =>
                      newBook.category?.includes(option.value),
                    )}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Вес:</label>
                  <input
                    type="number"
                    value={newBook.weight || ''}
                    onChange={(e) => setNewBook({ ...newBook, weight: Number(e.target.value) })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Язык:</label>
                  <input
                    type="text"
                    value={newBook.language || ''}
                    onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ISBN:</label>
                  <input
                    type="text"
                    value={newBook.isbn || ''}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Описание:*</label>
                  <textarea
                    value={newBook.description || ''}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroupImages}>
                <label className={styles.label}>Загрузите изображения:*</label>

                <div
                  className={styles.uploadButtonWrapper}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span>+</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className={styles.hiddenInput}
                  required
                />

                {selectedFiles.length > 0 && (
                  <div className={styles.selectedFiles}>
                    <p>Загруженные изображения:</p>
                    <p>{selectedFiles.map((file) => file.name).join('; ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.rentConditions}>
              <div className={styles.formGroup}>
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
              <div className={styles.formGroup}>
                <label>Цена аренды (руб/день)*</label>
                <input
                  type="number"
                  value={newBook.price || ''}
                  onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Залог (руб)</label>
                <input
                  type="number"
                  min="0"
                  value={newBook.deposit || 0}
                  onChange={(e) => setNewBook({ ...newBook, deposit: Number(e.target.value) })}
                />
              </div>
              <AddressPicker
                onSelect={handleAddressSelect}
                apiKey="cfef434a-5494-4440-a548-f7408e0226d2"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.stepContent}>
            <div className={styles.confirmation}>
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
              <p>Язык: {newBook.language}</p>
              <p>Категории: {newBook.category?.join(', ')}</p>
              <p>Описание: {newBook.description}</p>
              <p>Состояние: {newBook.condition}</p>
              <p>Тип: {newBook.type}</p>
              <p>Формат: {newBook.format}</p>
              <p>Издательство: {newBook.publisher || 'Не указано'}</p>
              <p>Город издания: {newBook.publishingCity || 'Не указано'}</p>
              <p>Количество страниц: {newBook.pages || 'Не указано'}</p>
              <h4>Условия аренды:</h4>
              <p>Минимальный срок: {newBook.minDaysToRent} дней</p>
              <p>Цена аренды: {newBook.price} руб.</p>
              <p>Залог: {newBook.deposit || 0} руб.</p>
              <h4>Адрес:</h4>
              <p>{newBook.address}</p>
              <h4>Изображения:</h4>
              <div className={styles.previewImages}>
                {selectedFiles.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className={styles.previewImage}
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
    <div className={styles.myRentBooks}>
      <div className={styles.header}>
        <DashboardTitle>Мои объявления</DashboardTitle>
        <button onClick={() => setIsModalOpen(true)} className={styles.headerAddButton}>
          + разместить объявление
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <div className={styles.modalHeader}>
              <h2>Новое объявление</h2>
              <h3>
                Шаг {currentStep}: {stepTitles[currentStep - 1]}
              </h3>
              <div className={styles.stepsIndicator}>
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`${styles.step} ${currentStep === step ? styles.active : ''} ${
                      currentStep > step ? styles.completed : ''
                    }`}
                    onClick={() => currentStep > step && setCurrentStep(step)}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <form className={styles.createBookForm} encType="multipart/form-data">
              {renderStep()}
              <div className={styles.modalFooter}>
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className={styles.secondaryButton}>
                    Назад
                  </button>
                )}
                {currentStep < 5 ? (
                  <button type="button" onClick={nextStep} className={styles.primaryButton}>
                    Далее
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={rentBookStore.isLoading}
                    className={styles.primaryButton}
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
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}
      {rentBookStore.books.length > 0 ? (
        <MyRentBookList
          books={rentBookStore.books}
          currentImageIndices={currentImageIndices}
          setCurrentImageIndices={setCurrentImageIndices}
        />
      ) : (
        !rentBookStore.isLoading && <p>У вас пока нет книг</p>
      )}
    </div>
  );
});

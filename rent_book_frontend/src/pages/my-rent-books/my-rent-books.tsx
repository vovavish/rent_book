import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { useEffect, useState, useRef } from 'react';
import {
  CreateBookDto,
  Condition,
  Format,
  BookStatus,
  Type,
  AgeRating,
  Periodicity,
  MaterialConstruction,
  typeTranslations,
  conditionTranslations,
  ageRatingTranslations,
  periodicityTranslations,
  materialConstructionTranslations,
  formatTranslations,
  categoryTranslations,
} from '../../types/response/bookResponse';
import styles from './my-rent-books.module.scss';
import { MyRentBookList } from '../../components/book/my-rent-books/my-rent-book-list';
import { DashboardTitle } from '../../components/ui/dashboard-title';
import { AddressPicker } from '../../components/address-picker/address-picker';
import Select from 'react-select';
import clsx from 'clsx';
import { UserActionButton } from '../../components/ui';
import {
  ageRatingOptions,
  categoryOptions,
  conditionOptions,
  formatOptions,
  materialConstructionOptions,
  periodicityOptions,
  typeOptions,
} from '../../constants/translations';
import { customStyles } from '../../constants/react-select-styles';
import { ModalWithChildren } from '../../components/modal/modal-with-children';
import { Link } from 'react-router-dom';

export const MyRentBooksPage = observer(() => {
  const { rentBookStore, userProfileStore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newBook, setNewBook] = useState<Partial<CreateBookDto>>({
    availabilityStatus: BookStatus.ACTIVE,
    deposit: 0,
    minDaysToRent: 1,
    category: [],
    price: 0,
    isCashPayment: false,
    address: 'Россия, Москва',
    lat: 37.6173,
    lon: 55.7558,
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
    if (currentStep === 2 && !selectedCard && !newBook.isCashPayment) {
      alert('Пожалуйста, выберите средство получения оплаты');
      return;
    }
    if (
      currentStep === 3 &&
      (!newBook.title ||
        !newBook.author ||
        !newBook.publishingCity ||
        !newBook.publisher ||
        !newBook.publishedYear ||
        !newBook.printRun ||
        !newBook.pages ||
        !newBook.type ||
        !newBook.condition ||
        !newBook.ageRestriction ||
        !newBook.description ||
        !selectedFiles.length)
    ) {
      alert('Пожалуйста, заполните обязательные поля (*)');
      return;
    }
    if (
      (currentStep === 4 && (!newBook.minDaysToRent || !newBook.address)) ||
      newBook.price === undefined
    ) {
      alert('Пожалуйста, заполните обязательные поля (*)');
      return;
    }
    if (currentStep === 4 && (newBook.price < 0 || newBook.deposit! < 0 || newBook.minDaysToRent! < 0)) {
      alert('Минимальный срок, цена и депозит не могут быть отрицательными!');
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
      condition: undefined,
      format: undefined,
      availabilityStatus: BookStatus.ACTIVE,
      deposit: 0,
      minDaysToRent: 1,
      type: undefined,
      category: [],
      isCashPayment: false,
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
    console.log('address', address);
    console.log('lat', lat);
    console.log('lon', lon);
    setNewBook((prev) => ({ ...prev, address, lat, lon }));
  };

  const renderStep = () => {
    const profile = userProfileStore.profile;

    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.ownerInfo}>
              <p className={styles.standardText}>
                <span className={styles.boldText}>Имя:</span> {profile?.name || 'Не указано'}
              </p>
              <p className={styles.standardText}>
                <span className={styles.boldText}>Фамилия:</span>{' '}
                {profile?.lastname || 'Не указано'}
              </p>
              <p className={styles.standardText}>
                <span className={styles.boldText}>Отчество:</span>{' '}
                {profile?.surname || 'Не указано'}
              </p>
              <p className={styles.standardText}>
                <span className={styles.boldText}>Email:</span> {profile?.email || 'Не указано'}
              </p>
              <p className={styles.standardText}>
                <span className={styles.boldText}>
                  Телефон{profile?.phoneNumbers?.length || 0 > 1 ? 'ы' : ''}:
                </span>{' '}
                {profile?.phoneNumbers.length
                  ? profile.phoneNumbers.map((phone, index) => (
                      <span key={index}>
                        {phone}
                        {index < profile.phoneNumbers.length - 1 && ', '}
                      </span>
                    ))
                  : 'Не указано'}
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
                    onClick={() => {
                      setSelectedCard(card);
                      setNewBook({ ...newBook, isCashPayment: false });
                    }}
                  >
                    **** **** **** {card.slice(-4)}
                  </div>
                ))
              ) : (
                <p className={clsx(styles.standardText, styles.warning)}>
                  У вас нет сохраненных карт. Пожалуйста, добавьте карту в профиле.
                </p>
              )}
            </div>
            <div className={styles.cashPaymentOption}>
              <input
                type="checkbox"
                checked={newBook.isCashPayment}
                id="isCashPayment"
                onChange={(e) => {
                  setNewBook({ ...newBook, isCashPayment: e.target.checked });
                  if (e.target.checked) {
                    setSelectedCard('');
                  }
                }}
              />
              <label htmlFor="isCashPayment" className={styles.standardText}>
                Получить оплату наличными
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.bookFormGrid}>
              <h3 className={styles.formTitle}>Основная информация:</h3>
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
                    min="1450"
                    max={new Date().getFullYear()}
                    value={newBook.publishedYear || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setNewBook({ ...newBook, publishedYear: 0 });
                        return;
                      }

                      const numberValue = Number(value);
                      if (!isNaN(numberValue)) {
                        setNewBook({ ...newBook, publishedYear: numberValue });
                      }
                    }}
                    onBlur={() => {
                      const year = newBook.publishedYear;
                      if (year && year < 1450) {
                        setNewBook({ ...newBook, publishedYear: 1450 });
                      } else if (year && year > new Date().getFullYear()) {
                        setNewBook({ ...newBook, publishedYear: new Date().getFullYear() });
                      }
                    }}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Тираж:*</label>
                  <input
                    type="number"
                    value={newBook.printRun || ''}
                    onChange={(e) => setNewBook({ ...newBook, printRun: Number(e.target.value) })}
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
                <label className={styles.accentLabel}>Тип издания:*</label>
                <Select
                  value={typeOptions.find((opt) => opt.value === newBook.type) || null}
                  onChange={(selectedOption) =>
                    setNewBook({
                      ...newBook,
                      type: selectedOption?.value as Type,
                    })
                  }
                  options={typeOptions}
                  placeholder="Не выбрано"
                  className={styles.select}
                  styles={customStyles}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.accentLabel}>Состояние:*</label>
                <Select
                  value={conditionOptions.find((opt) => opt.value === newBook.condition) || null}
                  onChange={(selectedOption) =>
                    setNewBook({
                      ...newBook,
                      condition: selectedOption?.value as Condition,
                    })
                  }
                  options={conditionOptions}
                  placeholder="Не выбрано"
                  className={styles.select}
                  styles={customStyles}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.accentLabel}>Возрастное ограничение:*</label>
                <Select
                  value={
                    ageRatingOptions.find((opt) => opt.value === newBook.ageRestriction) || null
                  }
                  onChange={(selectedOption) =>
                    setNewBook({
                      ...newBook,
                      ageRestriction: selectedOption?.value as AgeRating,
                    })
                  }
                  options={ageRatingOptions}
                  placeholder="Не выбрано"
                  className={styles.select}
                  styles={customStyles}
                />
              </div>
              <h3 className={styles.formTitle}>Прочее:</h3>
              <div className={styles.formGroupWrapper}>
                <div className={styles.formGroup}>
                  <label>Переодичность издания:</label>
                  <Select
                    value={
                      periodicityOptions.find((opt) => opt.value === newBook.periodicity) || null
                    }
                    onChange={(selectedOption) =>
                      setNewBook({
                        ...newBook,
                        periodicity: selectedOption?.value as Periodicity,
                      })
                    }
                    options={periodicityOptions}
                    placeholder="Не выбрано"
                    className={styles.select}
                    styles={customStyles}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Материальная конструкция:</label>
                  <Select
                    value={
                      materialConstructionOptions.find(
                        (opt) => opt.value === newBook.materialConstruction,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setNewBook({
                        ...newBook,
                        materialConstruction: selectedOption?.value as MaterialConstruction,
                      })
                    }
                    options={materialConstructionOptions}
                    placeholder="Не выбрано"
                    className={styles.select}
                    styles={customStyles}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Формат:</label>

                  <Select
                    value={formatOptions.find((opt) => opt.value === newBook.format) || null}
                    onChange={(selectedOption) =>
                      setNewBook({
                        ...newBook,
                        format: selectedOption?.value as Format,
                      })
                    }
                    options={formatOptions}
                    placeholder="Не выбрано"
                    className={styles.select}
                    styles={customStyles}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Жанры:</label>
                  <Select
                    isMulti
                    className={styles.select}
                    options={categoryOptions}
                    onChange={(e) =>
                      setNewBook({ ...newBook, category: e.map((item) => item.value) })
                    }
                    value={categoryOptions.filter((option) =>
                      newBook.category?.includes(option.value),
                    )}
                    placeholder="Выберите жанры..."
                    styles={customStyles}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Вес (г):</label>
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
                {newBook.type !== Type.NOTEBOOK && (
                  <div className={styles.formGroup}>
                    <label>ISBN:</label>
                    <input
                      type="text"
                      value={newBook.isbn || ''}
                      onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                      required
                    />
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label>Индекс УДК:</label>
                  <input
                    type="text"
                    value={newBook.indexUDK || ''}
                    onChange={(e) => setNewBook({ ...newBook, indexUDK: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Индекс ББК:</label>
                  <input
                    type="text"
                    value={newBook.indexBBK || ''}
                    onChange={(e) => setNewBook({ ...newBook, indexBBK: e.target.value })}
                    required
                  />
                </div>
                {newBook.type === Type.NOTEBOOK && (
                  <div className={styles.formGroup}>
                    <label>ISMN:</label>
                    <input
                      type="text"
                      value={newBook.isnm || ''}
                      onChange={(e) => setNewBook({ ...newBook, isnm: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>

              <div className={clsx(styles.formGroup, styles.formGroupDescription)}>
                <label className={styles.formTitle}>Описание:*</label>
                <textarea
                  value={newBook.description || ''}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroupImages}>
                <h3 className={styles.formTitle}>Загрузите изображения:*</h3>

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
            <div className={styles.accentText}>* - обязательно к заполнению</div>
          </div>
        );
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.rentConditions}>
              <div className={styles.formGroup}>
                <label className={styles.accentLabel}>Минимальный срок аренды (дни)*</label>
                <input
                  type="number"
                  min="1"
                  value={newBook.minDaysToRent || ''}
                  onChange={(e) =>
                    setNewBook({ ...newBook, minDaysToRent: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.accentLabel}>Цена аренды (руб/день)*</label>
                <input
                  type="number"
                  value={newBook.price || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewBook({ ...newBook, price: val === '' ? undefined : Number(val) });
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.accentLabel}>Депозит (руб)</label>
                <input
                  type="number"
                  min="0"
                  value={newBook.deposit || ''}
                  onChange={(e) => setNewBook({ ...newBook, deposit: Number(e.target.value) })}
                />
              </div>
              <AddressPicker
                onSelect={handleAddressSelect}
                apiKey="cfef434a-5494-4440-a548-f7408e0226d2"
                defaultLocation={{
                  address: newBook.address || 'Россия, Москва',
                  lat: newBook.lat || 37.617698,
                  lon: newBook.lon || 55.755864,
                }}
              />
            </div>
            <div className={styles.accentText}>* - обязательно к заполнению</div>
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
              <p>
                Телефон{profile?.phoneNumbers?.length || 0 > 1 ? 'ы' : ''}:{' '}
                {profile?.phoneNumbers.length
                  ? profile.phoneNumbers.map((phone, index) => (
                      <span key={index}>
                        {phone}
                        {index < profile.phoneNumbers.length - 1 && ', '}
                      </span>
                    ))
                  : 'Не указано'}
              </p>
              <h4>Карта:</h4>
              <p>**** **** **** {selectedCard.slice(-4)}</p>
              <h4>Информация об издании:</h4>
              <p>ISBN: {newBook.isbn || 'Не указано'}</p>
              <p>Название: {newBook.title}</p>
              <p>Частотное название: {newBook.frequencyTitle || 'Не указано'}</p>
              <p>
                Состояние:{' '}
                {(newBook.condition && conditionTranslations[newBook.condition]) || 'Не указано'}
              </p>
              <p>Год издания: {newBook.publishedYear}</p>
              <p>Язык: {newBook.language || 'Не указано'}</p>
              <p>
                Категории:{' '}
                {newBook.category?.map((cat) => categoryTranslations[cat]).join(', ') ||
                  'Не указано'}
              </p>
              <p>Описание: {newBook.description}</p>
              <p>Автор: {newBook.author}</p>
              <p>Издательство: {newBook.publisher || 'Не указано'}</p>
              <p>Город издания: {newBook.publishingCity}</p>
              <p>Количество страниц: {newBook.pages || 'Не указано'}</p>
              <p>Формат: {newBook.format ? formatTranslations[newBook.format] : 'Не указано'}</p>
              <p>Тираж: {newBook.printRun || 'Не указано'}</p>
              <p>Вес: {newBook.weight || 'Не указано'}</p>
              <p>
                Возрастное ограничение:{' '}
                {newBook.ageRestriction
                  ? ageRatingTranslations[newBook.ageRestriction]
                  : 'Не указано'}
              </p>
              <p>Цена: {newBook.price}</p>
              <p>Депозит: {newBook.deposit}</p>
              <p>Минимальный срок аренды: {newBook.minDaysToRent}</p>
              <p>Тип: {(newBook.type && typeTranslations[newBook.type]) || 'Не указано'}</p>
              <p>
                Периодичность:{' '}
                {newBook.periodicity ? periodicityTranslations[newBook.periodicity] : 'Не указано'}
              </p>
              <p>
                Материальная конструкция:{' '}
                {newBook.materialConstruction
                  ? materialConstructionTranslations[newBook.materialConstruction]
                  : 'Не указано'}
              </p>
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
            <div>
              <p className={clsx(styles.standardText, styles.marginTop)}>
                При размещении объявления вы соглашаетесь с{' '}
                <Link to="terms">условиями использования</Link> и{' '}
                <Link to="privacy">политикой конфиденциальности</Link>
              </p>
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
        <UserActionButton onClick={() => setIsModalOpen(true)} variant="owner">
          + разместить объявление
        </UserActionButton>
      </div>

      {isModalOpen && (
        <ModalWithChildren onCancel={closeModal} headerText="Новое объявление">
          <div className={styles.modalHeader}>
            <h3 className={styles.modalHeader__step}>
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
                <UserActionButton type="button" onClick={nextStep} variant="owner">
                  Далее &gt;
                </UserActionButton>
              ) : (
                <UserActionButton
                  type="button"
                  disabled={rentBookStore.isLoading}
                  className={styles.primaryButton}
                  onClick={handleCreateBook}
                >
                  {rentBookStore.isLoading ? 'Создание...' : 'Опубликовать'}
                </UserActionButton>
              )}
            </div>
          </form>
        </ModalWithChildren>
      )}

      {rentBookStore.isLoading && !isModalOpen && <p>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}
      <MyRentBookList
        books={rentBookStore.books}
        currentImageIndices={currentImageIndices}
        setCurrentImageIndices={setCurrentImageIndices}
      />
    </div>
  );
});

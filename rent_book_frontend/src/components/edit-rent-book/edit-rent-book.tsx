import { useEffect, useRef, useState } from 'react';
import styles from './edit-rent-bool.module.scss';
import {
  AgeRating,
  BookResponse,
  Condition,
  Format,
  MaterialConstruction,
  Periodicity,
  Type,
} from '../../types/response/bookResponse';
import {
  ageRatingOptions,
  categoryOptions,
  conditionOptions,
  formatOptions,
  materialConstructionOptions,
  periodicityOptions,
  typeOptions,
} from '../../constants/translations';
import Select from 'react-select';
import { customStyles } from '../../constants/react-select-styles';
import clsx from 'clsx';
import { useStore } from '../../hooks/useStore';
import { Preloader, UserActionButton } from '../ui';
import { AddressPicker } from '../address-picker/address-picker';

interface EditRentBookProps {
  bookId: number;
  onSaveData: () => void;
}

export const EditRentBook = ({ bookId, onSaveData }: EditRentBookProps) => {
  const { rentBookStore, userProfileStore } = useStore();

  const [newBook, setNewBook] = useState<Partial<BookResponse | null>>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        userProfileStore.fetchProfile();
        await rentBookStore.fetchToRentalBookById(bookId);
        setNewBook(rentBookStore.currentBook!);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
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

  const handleSaveBook = async () => {
    if (
      !newBook ||
      !newBook.title ||
      !newBook.author ||
      !newBook.publishingCity ||
      !newBook.publisher ||
      !newBook.publishedYear ||
      !newBook.printRun ||
      !newBook.pages ||
      !newBook.type ||
      !newBook.condition ||
      !newBook.ageRestriction ||
      !newBook.description
    ) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('coverImages', file));
      const { id, userId, user, ...newBookWithoutIdAndUser } = newBook!;
      formData.append(
        'data',
        JSON.stringify({
          ...newBookWithoutIdAndUser,
          cardNumber: selectedCard,
        }),
      );
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      await rentBookStore.updateBook(bookId, formData);
      onSaveData();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  if (!rentBookStore.currentBook || !newBook || !userProfileStore.profile) {
    return <Preloader />;
  }

  return (
    <div className={styles.stepContent}>
      <div className={styles.cardsList}>
        <h3 className={styles.formTitle}>Карта:</h3>
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
              value={newBook.publishedYear || ''}
              onChange={(e) => setNewBook({ ...newBook, publishedYear: Number(e.target.value) })}
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
          <label className={styles.accentLabel}>Тип издания*</label>
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
          <label className={styles.accentLabel}>Состояние*</label>
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
            value={ageRatingOptions.find((opt) => opt.value === newBook.ageRestriction) || null}
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
              value={periodicityOptions.find((opt) => opt.value === newBook.periodicity) || null}
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
              onChange={(e: any) =>
                setNewBook({ ...newBook, category: e.map((item: any) => item.value) })
              }
              value={categoryOptions.filter((option) => newBook.category?.includes(option.value))}
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
          <div className={styles.formGroup}>
            <label>ISBN:</label>
            <input
              type="text"
              value={newBook.isbn || ''}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              required
            />
          </div>
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

          <div className={styles.uploadButtonWrapper} onClick={() => fileInputRef.current?.click()}>
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

          <div className={styles.previewImages}>
            {newBook.coverImagesUrls?.map((file, index) => (
              <img
                key={index}
                src={file}
                alt={`Preview ${index}`}
                className={styles.previewImage}
              />
            ))}
          </div>

          <div className={styles.rentConditions}>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Минимальный срок аренды (дни)*</label>
              <input
                type="number"
                min="1"
                value={newBook.minDaysToRent || 1}
                onChange={(e) => setNewBook({ ...newBook, minDaysToRent: Number(e.target.value) })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Цена аренды (руб/день)*</label>
              <input
                type="number"
                value={newBook.price || ''}
                onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Залог (руб)</label>
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
              defaultLocation={{ address: newBook.address!, lat: newBook.lat!, lon: newBook.lon! }}
            />
          </div>
        </div>
      </div>
      <div className={styles.accentText}>* - обязательно к заполнению</div>
      <UserActionButton onClick={handleSaveBook}>Сохранить изменения</UserActionButton>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import styles from './contact.module.scss';
import {
  AgeRating,
  ageRatingTranslations,
  BookResponse,
  categoryTranslations,
  Condition,
  conditionTranslations,
  Format,
  formatTranslations,
  MaterialConstruction,
  materialConstructionTranslations,
  Periodicity,
  periodicityTranslations,
  Type,
  typeTranslations,
} from '../../types/response/bookResponse';
import clsx from 'clsx';
import { useStore } from '../../hooks/useStore';
import { Preloader } from '../ui';
import { observer } from 'mobx-react-lite';

interface ContractProps {
  rentalId: number;
}

export const Contract = observer(({ rentalId }: ContractProps) => {
  const { rentBookStore, userProfileStore } = useStore();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        userProfileStore.fetchProfile();
        await rentBookStore.fetchRentalById(rentalId);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, []);

  const rental = rentBookStore.currentRental!;

  if (!rental) {
    return <Preloader />
  }

  return (
    <div className={styles.stepContent}>
      <div className={styles.bookFormGrid}>
        <h3 className={styles.formTitle}>Владелец:</h3>
        <div className={styles.formGroup}>
          <div>{rental.ownerLastname} {rental.ownerName} {rental.ownerSurname}</div>
          <div>{rental.ownerPhones.join(', ')}</div>
        </div>
        <h3 className={styles.formTitle}>Читатель:</h3>
        <div className={styles.formGroup}>
          <div>{rental.renterLastname} {rental.renterName} {rental.renterSurname}</div>
          {rental.renterPhones && <div>{rental.renterPhones.join(', ')}</div>}
        </div>
        <h3 className={styles.formTitle}>Основная информация:</h3>
        <div className={styles.formGroupWrapper}>
          <div className={styles.formGroup}>
            <label>Автор: {rental.bookAuthor}</label>
          </div>
          <div className={styles.formGroup}>
            <label>Название: {rental.bookTitle}</label>
          </div>
          {rental.bookFrequencyTitle && (
            <div className={styles.formGroup}>
              <label>Частное название: {rental.bookFrequencyTitle}</label>
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Город издательства:{rental.bookPublishingCity}</label>
          </div>
          <div className={styles.formGroup}>
            <label>Издательство: {rental.bookPublisher}</label>
          </div>
          <div className={styles.formGroup}>
            <label>Год издания: {rental.bookPublishedYear}</label>
          </div>
          <div className={styles.formGroup}>
            <label>Тираж: {rental.bookPrintRun}</label>
          </div>
          <div className={styles.formGroup}>
            <label>Количество страниц: {rental.bookPages}</label>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.accentLabel}>Тип издания {typeTranslations[rental.bookType]}</label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.accentLabel}>
            Состояние {conditionTranslations[rental.bookCondition]}
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.accentLabel}>
            Возрастное ограничение: {ageRatingTranslations[rental.bookAgeRestriction!]}
          </label>
        </div>
        <h3 className={styles.formTitle}>Прочее:</h3>
        <div className={styles.formGroupWrapper}>
          <div className={styles.formGroup}>
            {rental.bookPeriodicity && (
              <label>Переодичность издания: {periodicityTranslations[rental.bookPeriodicity]}</label>
            )}
          </div>
          <div className={styles.formGroup}>
            {rental.bookMaterialConstruction && (
              <label>
                Материальная конструкция:{' '}
                {materialConstructionTranslations[rental.bookMaterialConstruction]}
              </label>
            )}
          </div>
          <div className={styles.formGroup}>
            {rental.bookFormat && <label>Формат: {formatTranslations[rental.bookFormat]}</label>}
          </div>
          <div className={styles.formGroup}>
            {rental.bookCategory && <label>Жанры: {rental.bookCategory.map((c) => categoryTranslations[c]).join(', ')}</label>}
          </div>
          <div className={styles.formGroup}>
            {rental.bookWeight && <label>Вес (г): {rental.bookWeight}</label>}
          </div>
          <div className={styles.formGroup}>
            {rental.bookLanguage && <label>Язык: {rental.bookLanguage}</label>}
          </div>
          <div className={styles.formGroup}>
            {rental.bookIsbn && <label>ISBN: {rental.bookIsbn}</label>}
          </div>
        </div>

        <div className={clsx(styles.formGroup, styles.formGroupDescription)}>
          <label className={styles.formTitle}>Описание: {rental.bookDescription}</label>
        </div>

        <div className={styles.formGroupImages}>
          <h3 className={styles.formTitle}>Изображения объявления:*</h3>

          <div className={styles.previewImages}>
            {rental.bookCoverImages?.map((file, index) => (
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
              <label className={styles.accentLabel}>День начала аренды: {rental.rentStartDate}</label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>День конца аренды: {rental.rentEndDate}</label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Цена аренды: {rental.price} руб</label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Депозит {rental.deposit} руб</label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Адрес: {rental.address}</label>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './contact.module.scss';
import {
  ageRatingTranslations,
  categoryTranslations,
  conditionTranslations,
  formatTranslations,
  materialConstructionTranslations,
  periodicityTranslations,
  typeTranslations,
} from '../../types/response/bookResponse';
import clsx from 'clsx';
import { useStore } from '../../hooks/useStore';
import { Preloader } from '../ui';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

interface ContractProps {
  rentalId: number;
}

export const Contract = observer(({ rentalId }: ContractProps) => {
  const { rentBookStore } = useStore();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        await rentBookStore.fetchRentalById(rentalId);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [rentalId, rentBookStore]);

  const rental = rentBookStore.currentRental!;

  if (!rental) {
    return <Preloader />;
  }

  console.log('rentalsdfgsdfg', rental);

  return (
    <div className={styles.stepContent}>
      <div className={styles.bookFormGrid}>
        <p className={styles.attentionText}>
          Полный текст договора публичной оферты можно посмотреть <Link to="/public_offer">здесь.</Link>
        </p>
        <h3 className={styles.formTitle}>Арендодатель (владелец издания):</h3>
        <div className={styles.formGroupPerson}>
          <div>
            {rental.ownerLastname} {rental.ownerName} {rental.ownerSurname}
          </div>
          <div>{rental.owner.email}</div>
          <div>{rental.ownerPhones.join(', ')}</div>

          <div className={styles.formGroup}>
            <label className={styles.accentLabel}>Адрес: {rental.address}</label>
          </div>
        </div>
        <h3 className={styles.formTitle}>Арендатор (читатель):</h3>
        <div className={styles.formGroupPerson}>
          <div>
            {rental.renterLastname} {rental.renterName} {rental.renterSurname}
          </div>
          <div>{rental.renter.email}</div>
          {rental.renterPhones && <div>{rental.renterPhones.join(', ')}</div>}
        </div>
        <h3 className={styles.formTitle}>Информация об издании:</h3>
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
            <label>Город издательства: {rental.bookPublishingCity}</label>
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
          <label className={styles.accentLabel}>
            Тип издания: {typeTranslations[rental.bookType]}
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.accentLabel}>
            Состояние: {conditionTranslations[rental.bookCondition]}
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.accentLabel}>
            Возрастное ограничение: {ageRatingTranslations[rental.bookAgeRestriction!]}
          </label>
        </div>
        <div className={styles.formGroupWrapper}>
          <div className={styles.formGroup}>
            {rental.bookPeriodicity && (
              <label>
                Переодичность издания: {periodicityTranslations[rental.bookPeriodicity]}
              </label>
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
            {rental.bookCategory.length > 0 && (
              <label>
                Жанры: {rental.bookCategory.map((c) => categoryTranslations[c]).join(', ')}
              </label>
            )}
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
          <div className={styles.formGroup}>
            {rental.bookIndexBBK && <label>Индекс ББК: {rental.bookIndexBBK}</label>}
          </div>
          <div className={styles.formGroup}>
            {rental.bookIndexUDK && <label>Индекс УДК: {rental.bookIndexUDK}</label>}
          </div>
          <div className={styles.formGroup}>
            {rental.bookIsnm && <label>ISNM: {rental.bookIsnm}</label>}
          </div>
        </div>

        <div className={clsx(styles.formGroup, styles.formGroupDescription)}>
          <label>Описание: {rental.bookDescription}</label>
        </div>

        <div className={styles.formGroupImages}>
          <h3 className={styles.formTitle}>Изображения издания:</h3>

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

          <h3 className={styles.formTitle}>Условия аренды:</h3>
          <div className={styles.rentConditions}>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>
                C {dayjs(rental.rentStartDate).format('DD.MM.YYYY')} до{' '}
                {dayjs(rental.rentEndDate).format('DD.MM.YYYY')} (
                {dayjs(rental.rentEndDate).diff(dayjs(rental.rentStartDate), 'days')} дней)
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}></label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>
                Цена аренды: {rental.pricePerDay} руб/день
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Депозит: {rental.deposit} руб</label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Итого: {rental.price} руб</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

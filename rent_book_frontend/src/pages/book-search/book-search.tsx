import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import styles from './book-search.module.scss';
import { BookSearchDto } from '../../types/response/bookSearch';
import {
  AgeRating,
  Category,
  Condition,
  Format,
  MaterialConstruction,
  Periodicity,
  Type,
} from '../../types/response/bookResponse';
import { useStore } from '../../hooks/useStore';
import { observer } from 'mobx-react-lite';
import { Preloader, UserActionButton } from '../../components/ui';
import { BookList } from '../../components/book/book-list';
import { EmptyText } from '../../components/empty-text/empty-text';
import Select from 'react-select';
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

export const BookSearch = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [formSearchData, setFormSearchData] = useState<BookSearchDto>({
    query: searchParams.get('query') || '',
    author: searchParams.get('author') || '',
    category: (searchParams.getAll('category') as Category[]) || '',
    type: (searchParams.get('type') as Type) || '',
    publisher: searchParams.get('publisher') || '',
    publishingCity: searchParams.get('publishingCity') || '',
    publishedYear: searchParams.get('publishedYear') || '',
    printRun: searchParams.get('printRun') || '',
    minPages: searchParams.get('minPages') || '',
    maxPages: searchParams.get('maxPages') || '',
    condition: (searchParams.get('condition') as Condition) || '',
    ageRestriction: (searchParams.get('ageRestriction') as AgeRating) || '',
    periodicity: (searchParams.get('periodicity') as Periodicity) || '',
    materialConstruction: (searchParams.get('materialConstruction') as MaterialConstruction) || '',
    format: (searchParams.get('format') as Format) || '',
    edition: searchParams.get('edition') ? Number(searchParams.get('edition')) : undefined,
    language: searchParams.get('language') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minDeposit: searchParams.get('minDeposit') || '',
    maxDeposit: searchParams.get('maxDeposit') || '',
    minDaysToRent: searchParams.get('minDaysToRent') || '',
    maxDaysToRent: searchParams.get('maxDaysToRent') || '',
    address: searchParams.get('address') || '',
    isCashPayment: searchParams.get('isCashPayment')
      ? searchParams.get('isCashPayment') === 'true' ? 'true' : 'false'
      : undefined,
  });

  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  const { rentBookStore } = useStore();

  const params = useMemo<BookSearchDto>(() => {
    return {
      query: searchParams.get('query') || undefined,
      author: searchParams.get('author') || undefined,
      category: (searchParams.getAll('category') as Category[]) || undefined,
      type: (searchParams.get('type') as Type) || undefined,
      publisher: searchParams.get('publisher') || undefined,
      publishingCity: searchParams.get('publishingCity') || undefined,
      publishedYear: searchParams.get('publishedYear') || undefined,
      printRun: searchParams.get('printRun') || undefined,
      pages: searchParams.get('pages') ? Number(searchParams.get('pages')) : undefined,
      minPages: searchParams.get('minPages') || undefined,
      maxPages: searchParams.get('maxPages') || undefined,
      condition: (searchParams.get('condition') as Condition) || undefined,
      ageRestriction: (searchParams.get('ageRestriction') as AgeRating) || undefined,
      periodicity: (searchParams.get('periodicity') as Periodicity) || undefined,
      materialConstruction:
        (searchParams.get('materialConstruction') as MaterialConstruction) || undefined,
      format: (searchParams.get('format') as Format) || undefined,
      edition: searchParams.get('edition') ? Number(searchParams.get('edition')) : undefined,
      language: searchParams.get('language') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      minDeposit: searchParams.get('minDeposit') || undefined,
      maxDeposit: searchParams.get('maxDeposit') || undefined,
      minDaysToRent: searchParams.get('minDaysToRent') || undefined,
      maxDaysToRent: searchParams.get('maxDaysToRent') || undefined,
      address: searchParams.get('address') || undefined,
      isCashPayment: searchParams.get('isCashPayment')
        ? searchParams.get('isCashPayment') === 'true' ? 'true' : 'false'
        : undefined,
    };
  }, [searchParams]);

  useEffect(() => {
    console.log('Поисковые параметры:', params);
    rentBookStore.searchBooks(params);
  }, [params]);

  const updateParams = (newParams: Partial<typeof params>) => {
    const updated = {
      ...params,
      ...newParams,
    };

    const filtered = Object.fromEntries(
      Object.entries(updated).filter(([_, v]) => v !== '' && v !== null && v !== undefined),
    ) as Record<string, string>;
    console.log('filtered', filtered);
    setSearchParams(filtered);
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();

    updateParams({
      query: formSearchData.query || '',
      author: formSearchData.author || '',
      category: formSearchData.category || ([] as Category[]),
      type: formSearchData.type || ('' as Type),
      publisher: formSearchData.publisher || '',
      publishingCity: formSearchData.publishingCity || '',
      publishedYear: formSearchData.publishedYear,
      printRun: formSearchData.printRun,
      minPages: formSearchData.minPages,
      maxPages: formSearchData.maxPages,
      condition: formSearchData.condition || ('' as Condition),
      ageRestriction: formSearchData.ageRestriction || ('' as AgeRating),
      periodicity: formSearchData.periodicity || ('' as Periodicity),
      materialConstruction: formSearchData.materialConstruction || ('' as MaterialConstruction),
      format: formSearchData.format || ('' as Format),
      edition: formSearchData.edition,
      language: formSearchData.language || '',
      minPrice: formSearchData.minPrice,
      maxPrice: formSearchData.maxPrice,
      minDeposit: formSearchData.minDeposit,
      maxDeposit: formSearchData.maxDeposit,
      minDaysToRent: formSearchData.minDaysToRent,
      maxDaysToRent: formSearchData.maxDaysToRent,
      address: formSearchData.address || '',
      isCashPayment: formSearchData.isCashPayment,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Поиск изданий</h1>
      <div className={styles.searchContainer}>
        <div className={styles.searchFormWrapper}>
          <form className={styles.searchForm} onSubmit={onSubmitSearch}>
            <div className={styles.formGroup}>
              <label>Название:</label>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск по названию"
                value={formSearchData.query}
                onChange={(e) => setFormSearchData((prev) => ({ ...prev, query: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Автор:</label>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск по автору"
                value={formSearchData.author}
                onChange={(e) => setFormSearchData((prev) => ({ ...prev, author: e.target.value }))}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Город издательства:</label>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск по городу издательства"
                value={formSearchData.publishingCity}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, publishingCity: e.target.value }))
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Издательство:</label>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск по издательству"
                value={formSearchData.publisher}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, publisher: e.target.value }))
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Год издания:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по году издания"
                value={formSearchData.publishedYear}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, publishedYear: e.target.value }))
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Тираж:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по тиражу"
                value={formSearchData.printRun}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, printRun: e.target.value }))
                }
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Минимум страниц:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по издательству"
                value={formSearchData.minPages}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, minPages: e.target.value }))
                }
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Максимум страниц:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по издательству"
                value={formSearchData.maxPages}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, maxPages: e.target.value }))
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Язык:</label>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск по языку"
                value={formSearchData.language}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, language: e.target.value }))
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Тип издания:</label>
              <Select
                value={typeOptions.find((opt) => opt.value === formSearchData.type) || null}
                onChange={(selectedOption) =>
                  setFormSearchData((prev) => ({ ...prev, type: selectedOption?.value as Type }))
                }
                options={typeOptions}
                placeholder="Не выбрано"
                className={styles.select}
                styles={customStyles}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Минимальная цена:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по минимальной цене"
                value={formSearchData.minPrice}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, minPrice: e.target.value }))
                }
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Максимальная цена:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по максимальной цене"
                value={formSearchData.maxPrice}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Минимальный депозит:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по минимальному депозиту"
                value={formSearchData.minDeposit}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, minDeposit: e.target.value }))
                }
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Максимальный депозит:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по максимальному депозиту"
                value={formSearchData.maxDeposit}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, maxDeposit: e.target.value }))
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Минимальное количество дней аренды:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по минимальному кол-ву дней аренды"
                value={formSearchData.minDaysToRent}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, minDaysToRent: e.target.value }))
                }
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Максимальное количество дней аренды:</label>
              <input
                type="number"
                className={styles.searchInput}
                placeholder="Поиск по максимальному кол-ву дней аренды"
                value={formSearchData.maxDaysToRent}
                onChange={(e) =>
                  setFormSearchData((prev) => ({ ...prev, maxDaysToRent: e.target.value }))
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Состояние:</label>
              <Select
                value={
                  conditionOptions.find((opt) => opt.value === formSearchData.condition) || null
                }
                onChange={(selectedOption) =>
                  setFormSearchData((prev) => ({
                    ...prev,
                    condition: selectedOption?.value as Condition,
                  }))
                }
                options={conditionOptions}
                placeholder="Не выбрано"
                className={styles.select}
                styles={customStyles}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.accentLabel}>Возрастное ограничение:</label>
              <Select
                value={
                  ageRatingOptions.find((opt) => opt.value === formSearchData.ageRestriction) ||
                  null
                }
                onChange={(selectedOption) =>
                  setFormSearchData((prev) => ({
                    ...prev,
                    ageRestriction: selectedOption?.value as AgeRating,
                  }))
                }
                options={ageRatingOptions}
                placeholder="Не выбрано"
                className={styles.select}
                styles={customStyles}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Периодичность издания:</label>
              <Select
                value={
                  periodicityOptions.find((opt) => opt.value === formSearchData.periodicity) || null
                }
                onChange={(selectedOption) =>
                  setFormSearchData((prev) => ({
                    ...prev,
                    periodicity: selectedOption?.value as Periodicity,
                  }))
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
                    (opt) => opt.value === formSearchData.materialConstruction,
                  ) || null
                }
                onChange={(selectedOption) =>
                  setFormSearchData((prev) => ({
                    ...prev,
                    materialConstruction: selectedOption?.value as MaterialConstruction,
                  }))
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
                value={formatOptions.find((opt) => opt.value === formSearchData.format) || null}
                onChange={(selectedOption) =>
                  setFormSearchData((prev) => ({
                    ...prev,
                    format: selectedOption?.value as Format,
                  }))
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
                value={categoryOptions.filter((opt) =>
                  formSearchData.category?.includes(opt.value),
                )}
                onChange={(selectedOptions) =>
                  setFormSearchData((prev) => ({
                    ...prev,
                    category: selectedOptions.map((opt) => opt.value as Category),
                  }))
                }
                options={categoryOptions}
                placeholder="Не выбрано"
                className={styles.select}
                styles={customStyles}
              />
            </div>
            <div className={styles.cashPaymentOption}>
              <input
                type="checkbox"
                checked={formSearchData.isCashPayment === 'true'}
                id="isCashPayment"
                onChange={(e) => {
                  setFormSearchData({ ...formSearchData, isCashPayment: e.target.checked ? 'true' : 'false' });
                }}
              />
              <label htmlFor="isCashPayment" className={styles.standardText}>
                Оплата только наличными
              </label>
            </div>
            <UserActionButton type="submit" variant="reader">
              Искать
            </UserActionButton>
            <UserActionButton
              onClick={(e) => {
                e.preventDefault();

                setFormSearchData({
                  query: '',
                  author: '',
                  category: [],
                  type: '' as Type,
                  publisher: '',
                  publishingCity: '',
                  publishedYear: '',
                  printRun: '',
                  minPages: '',
                  maxPages: '',
                  condition: '' as Condition,
                  ageRestriction: '' as AgeRating,
                  periodicity: '' as Periodicity,
                  materialConstruction: '' as MaterialConstruction,
                  format: '' as Format,
                  edition: undefined,
                  language: '',
                  minPrice: '',
                  maxPrice: '',
                  minDeposit: '',
                  maxDeposit: '',
                  minDaysToRent: '',
                  maxDaysToRent: '',
                  address: '',
                  isCashPayment: undefined,
                });

                setSearchParams({});
              }}
              variant="owner"
            >
              Сбросить
            </UserActionButton>
          </form>
        </div>
        <div className={styles.bookListWrapper}>
          {rentBookStore.isLoading ? (
            <Preloader />
          ) : !rentBookStore.books.length ? (
            <EmptyText>Ничего не нашлось</EmptyText>
          ) : (
            <BookList
              books={rentBookStore.books}
              currentImageIndices={currentImageIndices}
              setCurrentImageIndices={setCurrentImageIndices}
            />
          )}
        </div>
      </div>
    </div>
  );
});

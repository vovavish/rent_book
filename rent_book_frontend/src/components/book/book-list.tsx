// components/book/BookList.tsx
import { FC } from 'react';
import { BookCard } from './book-card';

import { BookResponse } from '../../types/response/bookResponse';

import styles from './book-list.module.scss';

interface BookListProps {
  books: BookResponse[];
  currentImageIndices: Record<number, number>;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const BookList: FC<BookListProps> = ({
  books,
  currentImageIndices,
  setCurrentImageIndices,
}) => {
  if (books.length === 0) {
    return <p>Нет доступных книг</p>;
  }

  return (
    <div className={styles['books-list']}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          currentImageIndex={currentImageIndices[book.id] || 0}
          setCurrentImageIndices={setCurrentImageIndices}
        />
      ))}
    </div>
  );
};

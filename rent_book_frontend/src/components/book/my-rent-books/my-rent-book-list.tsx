// components/book/BookList.tsx
import { FC } from 'react';
import { MyRentBookCard } from './my-rent-book-card';

import { BookResponse } from '../../../types/response/bookResponse';

import styles from '../book-list.module.scss';
import { EmptyText } from '../../empty-text/empty-text';

interface MyRentBookListProps {
  books: BookResponse[];
  currentImageIndices: Record<number, number>;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const MyRentBookList: FC<MyRentBookListProps> = ({
  books,
  currentImageIndices,
  setCurrentImageIndices,
}) => {
  if (books.length === 0) {
    return <EmptyText>У вас пока нет книг</EmptyText>;
  }

  return (
    <div className={styles['books-list']}>
      {books.map((book) => (
        <MyRentBookCard
          key={book.id}
          book={book}
          currentImageIndex={currentImageIndices[book.id] || 0}
          setCurrentImageIndices={setCurrentImageIndices}
        />
      ))}
    </div>
  );
};

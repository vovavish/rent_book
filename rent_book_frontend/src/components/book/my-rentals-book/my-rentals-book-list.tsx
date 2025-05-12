import { FC } from 'react';

import { RentalResponse } from '../../../types/response/rentalResonse';
import { MyRentalsBookCard } from './my-rentals-book-card';

import styles from '../book-list.module.scss';
import { EmptyText } from '../../empty-text/empty-text';

interface MyRentalsBookListProps {
  rental: RentalResponse[];
  currentImageIndices: Record<number, number>;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const MyRentalsBookList: FC<MyRentalsBookListProps> = ({
  rental,
  currentImageIndices,
  setCurrentImageIndices,
}) => {
  if (rental.length === 0) {
    return <EmptyText>Вы пока ничего арендуете</EmptyText>;
  }

  return (
    <div className={styles['books-list']}>
      {rental.map((rental) => (
        <MyRentalsBookCard
          key={rental.id}
          rental={rental}
          currentImageIndex={currentImageIndices[rental.id] || 0}
          setCurrentImageIndices={setCurrentImageIndices}
        />
      ))}
    </div>
  );
};

import { FC } from 'react';

import { RentInOutBookCard } from './rent-in-out-book-card';

import styles from '../book-list.module.scss';
import { RentalResponse } from '../../../types/response/rentalResonse';
import { EmptyText } from '../../empty-text/empty-text';

interface RentInOutBookListProps {
  rental: RentalResponse[];
  currentImageIndices: Record<number, number>;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const RentInOutBookList: FC<RentInOutBookListProps> = ({
  rental,
  currentImageIndices,
  setCurrentImageIndices,
}) => {
  if (rental.length === 0) {
    return <EmptyText>Вы пока ничего не сдаете в аренду</EmptyText>;
  }
  console.log('rental', rental);
  return (
    <div className={styles['books-list']}>
      {rental.map((rental) => (
        <RentInOutBookCard
          key={rental.id}
          rental={rental}
          currentImageIndex={currentImageIndices[rental.id] || 0}
          setCurrentImageIndices={setCurrentImageIndices}
        />
      ))}
    </div>
  );
};

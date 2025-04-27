import { FC } from 'react';
import { RentalResponse } from '../../types/response/rentalResonse';

import styles from './book-home-slider.module.scss';

interface BookImageSliderRentalProps {
  rental: RentalResponse;
  rentalId: number;
  currentImageIndex: number;
  setCurrentImageIndices: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export const BookImageSliderRental: FC<BookImageSliderRentalProps> = ({
  rental,
  rentalId,
  currentImageIndex,
  setCurrentImageIndices,
}) => {
  const book = rental.book;
  const hasMultipleImages = book.coverImagesUrls?.length > 1;

  const nextImage = () => {
    const nextIdx = (currentImageIndex + 1) % book.coverImagesUrls.length;
    setCurrentImageIndices((prev) => ({ ...prev, [rentalId]: nextIdx }));
  };

  const prevImage = () => {
    const prevIdx = (currentImageIndex - 1 + book.coverImagesUrls.length) % book.coverImagesUrls.length;
    setCurrentImageIndices((prev) => ({ ...prev, [rentalId]: prevIdx }));
  };

  return (
    <div className={styles['book-images-slider']}>
      {book.coverImagesUrls?.length > 0 ? (
        <>
          <div className={styles['slider-container']}>
            {hasMultipleImages && (
              <button className={styles['slider-arrow']} onClick={prevImage}>
                &lt;
              </button>
            )}

            <img
              src={book.coverImagesUrls[currentImageIndex]}
              alt={`${book.title} cover`}
              className={styles['book-cover']}
            />

            {hasMultipleImages && (
              <button className={styles['slider-arrow']} onClick={nextImage}>
                &gt;
              </button>
            )}
          </div>

          {hasMultipleImages && (
            <div className={styles['slider-dots']}>
              {book.coverImagesUrls.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${currentImageIndex === index ? styles.active : ''}`}
                  onClick={() => setCurrentImageIndices((prev) => ({ ...prev, [rentalId]: index }))}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles['no-image-placeholder']}>Нет изображения</div>
      )}
    </div>
  );
};

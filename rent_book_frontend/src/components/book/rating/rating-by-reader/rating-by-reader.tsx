import { FC, useState } from 'react';
import styles from './rating-by-reader.module.scss';
import { Star } from 'lucide-react';
import { UserActionButton } from '../../../ui';

interface RatingByReaderProps {
  existingOwnerRating?: number | null;
  existingBookRating?: number | null;
  existingReviewContent?: string | null;
  onSubmit: (ownerRating: number, bookRating: number, reviewContent: string) => void;
}

export const RatingByReader: FC<RatingByReaderProps> = ({
  existingOwnerRating,
  existingBookRating,
  existingReviewContent,
  onSubmit
}) => {
  const [ownerRating, setOwnerRating] = useState<number | null>(null);
  const [bookRating, setBookRating] = useState<number | null>(null);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [ownerHover, setOwnerHover] = useState<number | null>(null);
  const [bookHover, setBookHover] = useState<number | null>(null);

  if (existingOwnerRating && existingBookRating) {
    return (
      <div className={styles.starsDisplay}>
        <div>
          <p>Оценка владельца:</p>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={24}
              color={index < existingOwnerRating ? '#ffc107' : '#e4e5e9'}
            />
          ))}
        </div>
        <div>
          <p>Оценка книги:</p>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={24}
              color={index < existingBookRating ? '#ffc107' : '#e4e5e9'}
            />
          ))}
        </div>
        {existingReviewContent && <p>Отзыв: {existingReviewContent}</p>}
      </div>
    );
  }

  return (
    <div className={styles.ratingInput}>
      <div>
        <p>Оцените владельца:</p>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <label key={starValue}>
              <input
                type="radio"
                name="ownerRating"
                value={starValue}
                onClick={() => setOwnerRating(starValue)}
                style={{ display: 'none' }}
              />
              <Star
                size={30}
                color={starValue <= (ownerHover ?? ownerRating ?? 0) ? '#ffc107' : '#e4e5e9'}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setOwnerHover(starValue)}
                onMouseLeave={() => setOwnerHover(null)}
              />
            </label>
          );
        })}
      </div>
      <div>
        <p>Оцените книгу:</p>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <label key={starValue}>
              <input
                type="radio"
                name="bookRating"
                value={starValue}
                onClick={() => setBookRating(starValue)}
                style={{ display: 'none' }}
              />
              <Star
                size={30}
                color={starValue <= (bookHover ?? bookRating ?? 0) ? '#ffc107' : '#e4e5e9'}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setBookHover(starValue)}
                onMouseLeave={() => setBookHover(null)}
              />
            </label>
          );
        })}
      </div>
      <div>
        <p>Отзыв о книге:</p>
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Напишите отзыв о книге (необязательно)"
          className={styles.reviewTextarea}
        />
      </div>
      <UserActionButton
        onClick={() => ownerRating && bookRating && onSubmit(ownerRating, bookRating, reviewContent)}
        disabled={!ownerRating || !bookRating}
        variant='reader'
      >
        Подтвердить оценку
      </UserActionButton>
    </div>
  );
};

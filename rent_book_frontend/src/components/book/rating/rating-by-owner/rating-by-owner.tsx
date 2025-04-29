import { FC, useState } from 'react';
import { Star } from 'lucide-react';
import { UserActionButton } from '../../../ui';

interface RenterRatingProps {
  rentalId: number;
  renterRating: number | null;
  onRateRenter: (rentalId: number, rating: number) => Promise<void>;
}

export const RatingByOwner: FC<RenterRatingProps> = ({ rentalId, renterRating, onRateRenter }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  if (renterRating !== null) {
    return (
      <div>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={24}
            color={index < renterRating ? '#ffc107' : '#e4e5e9'}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <label key={starValue}>
            <input
              type="radio"
              name="rating"
              value={starValue}
              onClick={() => setRating(starValue)}
              style={{ display: 'none' }}
            />
            <Star
              size={30}
              color={starValue <= (hover ?? rating ?? 0) ? '#ffc107' : '#e4e5e9'}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
      <UserActionButton
        onClick={() => rating && onRateRenter(rentalId, rating)}
        disabled={!rating}
        variant='owner'
      >
        Подтвердить оценку
      </UserActionButton>
    </div>
  );
};
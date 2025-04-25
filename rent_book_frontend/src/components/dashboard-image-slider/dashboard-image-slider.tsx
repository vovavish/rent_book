import { useState } from 'react';
import styles from './dashboard-image-slider.module.css';

type ImageSliderProps = {
  images: string[];
  currentImageIndex?: number;
  onIndexChange?: (newIndex: number) => void;
  className?: string;
};

export const DashboardImageSlider = ({
  images,
  currentImageIndex: controlledIndex,
  onIndexChange,
  className = '',
}: ImageSliderProps) => {
  const [localIndex, setLocalIndex] = useState(0);
  
  const isControlled = typeof controlledIndex !== 'undefined';
  const currentIndex = isControlled ? controlledIndex : localIndex;

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    if (isControlled && onIndexChange) {
      onIndexChange(newIndex);
    } else {
      setLocalIndex(newIndex);
    }
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    if (isControlled && onIndexChange) {
      onIndexChange(newIndex);
    } else {
      setLocalIndex(newIndex);
    }
  };

  const handleDotClick = (index: number) => {
    if (isControlled && onIndexChange) {
      onIndexChange(index);
    } else {
      setLocalIndex(index);
    }
  };

  if (images.length === 0) {
    return <div className={`${styles['no-image-placeholder']} ${className}`}>Нет изображения</div>;
  }

  const hasMultipleImages = images.length > 1;

  return (
    <div className={`${styles['book-images-slider']} ${className}`}>
      <div className={styles['slider-container']}>
        {hasMultipleImages && (
          <button 
            className={styles['slider-arrow']}
            onClick={handlePrev}
            aria-label="Previous image"
          >
            &lt;
          </button>
        )}
        
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`} 
          className={styles['book-cover']}
        />
        
        {hasMultipleImages && (
          <button 
            className={styles['slider-arrow']}
            onClick={handleNext}
            aria-label="Next image"
          >
            &gt;
          </button>
        )}
      </div>
      
      {hasMultipleImages && (
        <div className={styles['slider-dots']}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${currentIndex === index ? styles.active : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { useEffect, useState } from "react";
import styles from "./my-rentals.module.css";
import { DashboardImageSlider } from "../../components/dashboard-image-slider";
import { Preloader } from "../../components/ui/preloader";

export const MyRentalsPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<number, number>>({});

  useEffect(() => {
    if (authStore.isAuth) {
      rentBookStore.fetchUserRentals();
    }
  }, [authStore.isAuth]);

  const handleRentalAction = async (rentalId: number, action: string) => {
    try {
      switch (action) {
        case "confirm":
          await rentBookStore.confirmPayment(rentalId);
          break;
        case "confirmReceive":
          await rentBookStore.confirmReceivingBook(rentalId);
          break;
        case "confirmReturn":
          await rentBookStore.approveReturn(rentalId);
          break;
        case "rejectFromPending":
          await rentBookStore.rejectRentalFromPending(rentalId);
          break;
        case "rejectFromApprovedByOwner":
          await rentBookStore.rejectRentalFromApprovedByOwner(rentalId);
          break;
        case "cancelReceive":
          await rentBookStore.cancelRecivingBook(rentalId);
          break;
      }
    } catch (error) {
      console.error("Error handling rental action:", error);
    }
  };

  const handleImageIndexChange = (rentalId: number, newIndex: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [rentalId]: newIndex
    }));
  };

  if (rentBookStore.isLoading && rentBookStore.rentals.length === 0) {
    <Preloader />
  }
  console.log('rentBookStore.rentals',rentBookStore.rentals);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои аренды</h1>
      
      {rentBookStore.isLoading && <p className={styles.loading}>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}
      
      <div className={styles.rentalsList}>
        {rentBookStore.rentals.length > 0 ? (
          rentBookStore.rentals.map(rental => (
            <div key={rental.id} className={styles.rentalItem}>
              <div className={styles.imageSliderContainer}>
                <DashboardImageSlider
                  images={rental.book?.coverImagesUrls}
                  currentImageIndex={currentImageIndexes[rental.id] || 0}
                  onIndexChange={(newIndex) => handleImageIndexChange(rental.id, newIndex)}
                />
              </div>
              <div className={styles.rentalInfo}>
                <h3 className={styles.bookTitle}>{rental.book.title}</h3>
                <p className={styles.rentalDetail}>Автор: {rental.book.author}</p>
                <p className={styles.rentalDetail}>Статус: {rental.status}</p>
                <p className={styles.rentalDetail}>
                  С: {rental.rentStartDate ? new Date(rental.rentStartDate).toLocaleDateString() : "Не начата"}
                </p>
                <p className={styles.rentalDetail}>
                  По: {rental.rentEndDate ? new Date(rental.rentEndDate).toLocaleDateString() : "Не определено"}
                </p>
                <p className={styles.rentalDetail}>Владелец: {rental.owner.name}</p>
                <p className={styles.rentalDetail}>Арендатор: {rental.renter.name}</p>
                <p className={styles.rentalDetail}>Стоимость: {rental.price} рублей</p>
              
                <div className={styles.rentalActions}>
                  {rental.status === "PENDING" && rental.renterId === authStore.user?.id && (
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleRentalAction(rental.id, "rejectFromPending")}
                    >
                      Отклонить заявку
                    </button>
                  )}
                  {rental.status === "APPROVED_BY_OWNER" && rental.renterId === authStore.user?.id && (
                    <>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleRentalAction(rental.id, "confirm")}
                      >
                        Оплатить
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleRentalAction(rental.id, "rejectFromApprovedByOwner")}
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                  {rental.status === "GIVEN_TO_READER" && rental.renterId === authStore.user?.id && (
                    <>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleRentalAction(rental.id, "confirmReceive")}
                      >
                        Подтвердить получение
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleRentalAction(rental.id, "cancelReceive")}
                      >
                        Отменить
                      </button>
                    </>
                  )}
                  {rental.status === "RETURN_APPROVAL" && rental.ownerId === authStore.user?.id && (
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleRentalAction(rental.id, "confirmReturn")}
                    >
                      Подтвердить возврат
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          !rentBookStore.isLoading && <p className={styles.emptyState}>У вас нет арендованных книг</p>
        )}
      </div>
    </div>
  );
});
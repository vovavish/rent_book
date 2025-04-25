import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { useEffect, useState } from "react";
import styles from "./rent-in-out.module.css";
import { DashboardImageSlider } from "../../components/dashboard-image-slider";

export const MyRentalsInOutPage = observer(() => {
  const { rentBookStore, authStore } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});

  useEffect(() => {
    if (authStore.isAuth) {
      rentBookStore.fetchUserRentalsInOut();
    }
  }, [authStore.isAuth]);

  const handleRentalAction = async (rentalId: number, action: string) => {
    try {
      switch (action) {
        case "approve":
          await rentBookStore.approveRental(rentalId);
          break;
        case "reject":
          await rentBookStore.rejectRental(rentalId);
          break;
        case "rejectFromApproval":
          await rentBookStore.rejectRentalFromApproval(rentalId);
          break;
        case "confirm":
          await rentBookStore.confirmPayment(rentalId);
          break;
        case "giveToReader":
          await rentBookStore.confirmGivingBook(rentalId);
          break;
        case "confirmReceive":
          await rentBookStore.confirmReceivingBook(rentalId);
          break;
        case "confirmReturn":
          await rentBookStore.approveReturn(rentalId);
          break;
        case "cancelGivingBook":
          await rentBookStore.cancelGivingBook(rentalId);
          break;
      }
    } catch (error) {
      console.error("Error handling rental action:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Мои сдачи в аренду</h1>

      {rentBookStore.isLoading && <p className={styles.loading}>Загрузка...</p>}
      {rentBookStore.error && <p className={styles.error}>{rentBookStore.error}</p>}

      <div className={styles.rentalsList}>
        {rentBookStore.rentalsInOutBooks.length > 0 ? (
          rentBookStore.rentalsInOutBooks.map((rental) => (
            <div key={rental.id} className={styles.rentalItem}>
              <div className={styles.bookImagesSlider}>
                <DashboardImageSlider
                  images={rental.book.coverImagesUrls}
                  currentImageIndex={currentImageIndex[rental.id] || 0}
                  onIndexChange={(newIndex) =>
                    setCurrentImageIndex((prev) => ({ ...prev, [rental.id]: newIndex }))
                  }
                />
              </div>
              <div className={styles.rentalInfo}>
                <h3>{rental.book.title}</h3>
                <p>Автор: {rental.book.author}</p>
                <p>Статус: {rental.status}</p>
                <p>
                  С: {rental.rentStartDate ? new Date(rental.rentStartDate).toLocaleDateString() : "Не начата"}
                </p>
                <p>
                  По: {rental.rentEndDate ? new Date(rental.rentEndDate).toLocaleDateString() : "Не определено"}
                </p>
                <p>Владелец: {rental.owner.name}</p>
                <p>Арендатор: {rental.renter.name}</p>

                <div className={styles.rentalActions}>
                  {rental.status === "PENDING" && rental.ownerId === authStore.user?.id && (
                    <>
                      <button onClick={() => handleRentalAction(rental.id, "approve")}>
                        Принять
                      </button>
                      <button onClick={() => handleRentalAction(rental.id, "reject")}>
                        Отклонить
                      </button>
                    </>
                  )}
                  {rental.status === "APPROVED_BY_OWNER" && rental.ownerId === authStore.user?.id && (
                    <button onClick={() => handleRentalAction(rental.id, "rejectFromApproval")}>
                      Отклонить бронирование
                    </button>
                  )}
                  {rental.status === "CONFIRMED" && rental.ownerId === authStore.user?.id && (
                    <>
                      <button onClick={() => handleRentalAction(rental.id, "giveToReader")}>
                        Подтвердить передачу
                      </button>
                      <button onClick={() => handleRentalAction(rental.id, "cancelGivingBook")}>
                        Отклонить
                      </button>
                    </>
                  )}
                  {rental.status === "RETURN_APPROVAL" && rental.ownerId === authStore.user?.id && (
                    <button onClick={() => handleRentalAction(rental.id, "confirmReturn")}>
                      Подтвердить возврат
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          !rentBookStore.isLoading && <p className={styles.empty}>У вас пока нет аренд</p>
        )}
      </div>
    </div>
  );
});
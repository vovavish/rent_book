import ApiBookSearchController from '../../api/ApiBookSearchController';
import ApiRentBookController from '../../api/RentBookController';
import { BookResponse, BookReview } from '../../types/response/bookResponse';
import { BookSearchDto } from '../../types/response/bookSearch';
import { RentalResponse, CreateRentalDto, RentalStatus } from '../../types/response/rentalResonse';
import { makeAutoObservable, runInAction } from 'mobx';

export class RentBookStore {
  private _books: BookResponse[] = [];
  private _availableBooks: BookResponse[] = [];
  private _currentBook: BookResponse | null = null;
  private _currentBookReviews: BookReview[] = [];
  private _rentalsInOutBooks: RentalResponse[] = [];
  private _rentals: RentalResponse[] = [];
  private _currentRental: RentalResponse | null = null;
  private _favoriteBooks: BookResponse[] = [];

  private _isLoading = false;
  private _isFavoritesLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get books() {
    return this._books;
  }

  get favoriteBooks() {
    return this._favoriteBooks;
  }

  get availableBooks() {
    return this._availableBooks;
  }

  get rentalsInOutBooks() {
    return this._rentalsInOutBooks;
  }

  get currentBook() {
    return this._currentBook;
  }

  get currentBookReviews() {
    return this._currentBookReviews;
  }

  get rentals() {
    return this._rentals;
  }

  get currentRental() {
    return this._currentRental;
  }

  get isLoading() {
    return this._isLoading;
  }

  get isFavoritesLoading() {
    return this._isFavoritesLoading;
  }

  get error() {
    return this._error;
  }

  isFavorite(bookId: number): boolean {
    return this._favoriteBooks.some((book) => book.id === bookId);
  }

  async createBook(bookData: FormData) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.createBook(bookData);
      runInAction(() => {
        this._books.push(response);
      });
      return response;
    }, 'Failed to create book');
  }

  async fetchBooks() {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.getBooks();
      runInAction(() => {
        this._books = response;
      });
    }, 'Failed to fetch books');
  }

  async fetchBooksNews() {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.getBooksNews();
      runInAction(() => {
        this._books = response;
      });
    }, 'Failed to fetch books');
  }
  
  async fetchBooksRecommended() {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.getBooksRecommended();
      runInAction(() => {
        this._books = response;
      });
    }, 'Failed to fetch books');
  }
  
  async searchBooks(params: BookSearchDto) {
    await this.handleRequest(async () => {
      const response = await ApiBookSearchController.searchBooks(params);
      runInAction(() => {
        this._books = response;
      });
    }, 'Failed to fetch books');
  }

  async fetchUserBooks() {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.getUserBooks();
      runInAction(() => {
        this._books = response;
      });
    }, 'Failed to fetch books');
  }

  async fetchBookById(bookId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.getBookById(bookId);
      runInAction(() => {
        this._currentBook = response;
      });
    }, 'Failed to fetch book');
  }

  async fetchBookReviewsById(bookId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.getReviewsByBookId(bookId);
      runInAction(() => {
        this._currentBookReviews = response;
      });
    }, 'Failed to fetch book');
  }

  async fetchToRentalBookById(bookId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.getToRentalBookById(bookId);

      runInAction(() => {
        this._currentBook = response;
      })
    }, 'Failed to fetch book');
  }

  async fetchRentalById(rentalId: number) {
    try {
      this._error = null;
      const response = await ApiRentBookController.getRentalById(rentalId);
      runInAction(() => {
        this._currentRental = response;
      });
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this._error = 'Failed to fetch book';
      });
      throw e;
    }
  }

  async updateBook(bookId: number, bookData: FormData) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.updateBook(bookId, bookData);
      runInAction(() => {
        this._books = this._books.map((book) => (book.id === bookId ? response : book));
        if (this._currentBook?.id === bookId) {
          this._currentBook = response;
        }
      });
      return response;
    }, 'Failed to update book');
  }

  async deleteBook(bookId: number) {
    await this.handleRequest(async () => {
      await ApiRentBookController.deleteBook(bookId);
      runInAction(() => {
        this._books = this._books.filter((book) => book.id !== bookId);
        if (this._currentBook?.id === bookId) {
          this._currentBook = null;
        }
      });
    }, 'Failed to delete book');
  }

  async hideUserBook(bookId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.hideUserBook(bookId);
      runInAction(() => {
        this._books = this._books.map((book) => (book.id === bookId ? response : book));
      });
      return response;
    }, 'Failed to hide book');
  }

  async openUserBook(bookId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.openUserBook(bookId);
      runInAction(() => {
        this._books = this._books.map((book) => (book.id === bookId ? response : book));
      });
      return response;
    }, 'Failed to hide book');
  }

  async requestRental(rentalData: CreateRentalDto) {
    await this.handleRequest(async () => {
      await ApiRentBookController.requestRental(rentalData);
    }, 'Failed to request rental');
  }

  // Метод для принятия аренды
  async approveRental(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.approveRental(rentalId);
      runInAction(() => {
        // Здесь можно обновить статус аренды или другие данные
        this._rentalsInOutBooks = this._rentalsInOutBooks.map((rental) =>
          rental.id === rentalId
            ? { ...rental, status: 'APPROVED_BY_OWNER' as RentalStatus }
            : rental,
        );
      });
      return response;
    }, 'Failed to approve rental');
  }

  // Метод для отклонения аренды
  async rejectRental(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.rejectRental(rentalId);
      runInAction(() => {
        this._rentalsInOutBooks = this._rentalsInOutBooks.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'REJECTED' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to reject rental');
  }

  async rejectRentalFromApproval(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.rejectRentalFromApproval(rentalId);
      runInAction(() => {
        this._rentalsInOutBooks = this._rentalsInOutBooks.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'REJECTED' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to reject rental');
  }

  async rejectRentalFromPending(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.reject_rental_from_pending(rentalId);
      runInAction(() => {
        this._rentals = this.rentals.filter((rental) => rental.id !== rentalId);
      });
      return response;
    }, 'Failed to reject rental');
  }

  async rejectRentalFromApprovedByOwner(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.reject_rental_from_approved_by_owner(rentalId);
      runInAction(() => {
        this._rentals = this._rentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'REJECTED' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to reject rental');
  }

  // Метод для подтверждения оплаты аренды
  async confirmPayment(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.confirmPayment(rentalId);
      runInAction(() => {
        this._rentals = this._rentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'CONFIRMED' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to confirm payment');
  }

  // Метод для подтверждения передачи книги
  async confirmGivingBook(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.confirmGivingBook(rentalId);
      runInAction(() => {
        this._rentalsInOutBooks = this._rentalsInOutBooks.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'GIVEN_TO_READER' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to confirm giving book');
  }

  async cancelRecivingBook(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.cancelReceivingBook(rentalId);
      runInAction(() => {
        this._rentals = this._rentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'CANCELED' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to cancel receiving book');
  }

  async cancelGivingBook(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.cancelGivingBook(rentalId);
      runInAction(() => {
        this._rentalsInOutBooks = this._rentalsInOutBooks.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'CANCELED' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to cancel giving book');
  }

  // Метод для подтверждения получения книги
  async confirmReceivingBook(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.confirmReceivingBook(rentalId);
      runInAction(() => {
        this._rentals = this._rentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'ACTIVE' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to confirm receiving book');
  }

  // Метод для подтверждения возврата книги
  async approveReturn(rentalId: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.approveReturn(rentalId);
      runInAction(() => {
        this._rentalsInOutBooks = this._rentalsInOutBooks.map((rental) =>
          rental.id === rentalId ? { ...rental, status: 'COMPLETED' as RentalStatus } : rental,
        );
      });
      return response;
    }, 'Failed to approve return');
  }

  async fetchUserRentals() {
    await this.handleRequest(async () => {
      this._rentals = await ApiRentBookController.getUserRentals();
    }, 'Failed to fetch rentals');
  }

  async fetchUserRentalsInOut() {
    await this.handleRequest(async () => {
      this._rentalsInOutBooks = await ApiRentBookController.getUserRentalsInOut();
    }, 'Failed to fetch rentals');
  }

  clearError() {
    this._error = null;
  }

  async fetchUserFavorites() {
    await this.handleFavoritesRequest(async () => {
      const response = await ApiRentBookController.getUserFavorites();
      runInAction(() => {
        this._favoriteBooks = response;
      })
    }, 'Failed to fetch favorite books');
  }

  async addToFavorites(bookId: number) {
    try {
      this._error = null;
      await ApiRentBookController.addToFavorites(bookId);
      const book = await ApiRentBookController.getBookById(bookId);
      runInAction(() => {
        this._favoriteBooks.push(book);
      });
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this._error = 'Failed to add book to favorites';
      });
      throw e;
    }
  }

  async removeFromFavorites(bookId: number) {
    try {
      this._error = null;
      await ApiRentBookController.removeFromFavorites(bookId);
      runInAction(() => {
        this._favoriteBooks = this._favoriteBooks.filter((book) => book.id !== bookId);
      });
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this._error = 'Failed to remove book from favorites';
      });
      throw e;
    }
  }

  async rateRenter(rentalId: number, rating: number) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.rateRenter(rentalId, rating);
      runInAction(() => {
        this._rentalsInOutBooks = this._rentalsInOutBooks.map((rental) =>
          rental.id === rentalId ? { ...rental, ...response } : rental,
        );
      });
    }, 'Failed to rate renter');
  }

  async rateOwnerAndBook(
    rentalId: number,
    ownerRating: number,
    bookRating: number,
    reviewContent: string,
  ) {
    await this.handleRequest(async () => {
      const response = await ApiRentBookController.rateOwnerAndBook(
        rentalId,
        ownerRating,
        bookRating,
        reviewContent,
      );
      runInAction(() => {
        this._rentals = this._rentals.map((rental) =>
          rental.id === rentalId ? { ...rental, ...response } : rental,
        );
      });
    }, 'Failed to rate owner and book');
  }

  private async handleRequest(requestFn: () => Promise<unknown>, errorMessage: string) {
    try {
      this._isLoading = true;
      this._error = null;
      return await requestFn();
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this._error = errorMessage;
      });
      throw e;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  private async handleFavoritesRequest(requestFn: () => Promise<unknown>, errorMessage: string) {
    try {
      this._isFavoritesLoading = true;
      this._error = null;
      return await requestFn();
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this._error = errorMessage;
      });
      throw e;
    } finally {
      runInAction(() => {
        this._isFavoritesLoading = false;
      });
    }
  }
}

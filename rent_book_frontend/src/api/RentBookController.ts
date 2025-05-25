import { api } from './index';
import { BookResponse, BookReview } from '../types/response/bookResponse';
import { RentalResponse, CreateRentalDto } from '../types/response/rentalResonse';
import { ComplainBookDto } from '../types/complain/complain';

export default class ApiRentBookController {
  static async createBook(createBookDto: FormData): Promise<BookResponse> {
    return api.post<BookResponse>('/rent_books/create', createBookDto)
      .then(res => res.data);
  }

  static async getUserBooks(): Promise<BookResponse[]> {
    return api.get<BookResponse[]>('/rent_books/my_books')
      .then(res => res.data);
  }

  static async getBooks(): Promise<BookResponse[]> {
    return api.get<BookResponse[]>('/rent_books/books')
      .then(res => res.data);
  }

  static async getBooksNews(): Promise<BookResponse[]> {
    return api.get<BookResponse[]>('/rent_books/books/news')
      .then(res => res.data);
  }

  static async getBooksRecommended(): Promise<BookResponse[]> {
    return api.get<BookResponse[]>('/rent_books/books/recommended')
      .then(res => res.data);
  }

  static async getBookById(bookId: number): Promise<BookResponse> {
    return api.get<BookResponse>(`/rent_books/get/${bookId}`)
      .then(res => res.data);
  }

  static async getToRentalBookById(bookId: number): Promise<BookResponse> {
    return api.get<BookResponse>(`/rent_books/getToRental/${bookId}`)
      .then(res => res.data);
  }

  static async getRentalById(rentalId: number): Promise<RentalResponse> {
    return api.get<RentalResponse>(`/rent_books/getRentalById/${rentalId}`)
      .then(res => res.data);
  }

  static async updateBook(
    bookId: number,
    updateBookDto: FormData
  ): Promise<BookResponse> {
    return api.patch<BookResponse>(`/rent_books/update/${bookId}`, updateBookDto)
      .then(res => res.data);
  }

  static async deleteBook(bookId: number): Promise<unknown> {
    return api.delete(`/rent_books/delete/${bookId}`)
      .then(res => res.data);
  }

  static async hideUserBook(bookId: number): Promise<BookResponse> {
    return api.post(`/rent_books/hide/${bookId}`)
      .then(res => res.data);
  }

  static async openUserBook(bookId: number): Promise<BookResponse> {
    return api.post(`/rent_books/open/${bookId}`)
      .then(res => res.data);
  }

  static async requestRental(createRentalDto: CreateRentalDto): Promise<RentalResponse> {
    return api.post<RentalResponse>('/rent_books/request_rental', createRentalDto)
      .then(res => res.data);
  }

  static async approveRental(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/approve_rental/${rentalId}`)
      .then(res => res.data);
  }

  static async rejectRental(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/reject_rental/${rentalId}`)
      .then(res => res.data);
  }

  static async rejectRentalFromApproval(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/reject_rental_from_approval/${rentalId}`)
      .then(res => res.data);
  }
  
  static async reject_rental_from_pending(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/reject_rental_from_pending/${rentalId}`)
      .then(res => res.data);
  }

  static async reject_rental_from_approved_by_owner(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/reject_rental_from_approved_by_owner/${rentalId}`)
      .then(res => res.data);
  }

  static async confirmPayment(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/confirm_payment/${rentalId}`)
      .then(res => res.data);
  }

  static async confirmGivingBook(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/confirm_giving/${rentalId}`)
      .then(res => res.data);
  }

  static async cancelGivingBook(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/cancel_owner_rental/${rentalId}`)
      .then(res => res.data);
  }

  static async cancelReceivingBook(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/cancel_reader_rental/${rentalId}`)
      .then(res => res.data);
  }

  static async confirmReceivingBook(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/confirm_receiving/${rentalId}`)
      .then(res => res.data);
  }

  static async approveReturn(rentalId: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/approve_return/${rentalId}`)
      .then(res => res.data);
  }

  static async getUserRentals(): Promise<RentalResponse[]> {
    return api.get<RentalResponse[]>('/rent_books/my_rentals')
      .then(res => res.data);
  }

  static async getUserRentalsInOut(): Promise<RentalResponse[]> {
    return api.get<RentalResponse[]>('/rent_books/my_rentals_in_out')
      .then(res => res.data);
  }

  static async getUserFavorites(): Promise<BookResponse[]> {
    return api.get<BookResponse[]>('/rent_books/favorites')
      .then(res => res.data);
  }

  static async addToFavorites(bookId: number): Promise<void> {
    return api.post(`/rent_books/favorites/${bookId}`)
      .then(() => undefined);
  }

  static async removeFromFavorites(bookId: number): Promise<void> {
    return api.delete(`/rent_books/favorites/${bookId}`)
      .then(() => undefined);
  }

  static async rateRenter(rentalId: number, rating: number): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/rate_renter/${rentalId}`, { rating })
      .then(res => res.data);
  }
  
  static async rateOwnerAndBook(rentalId: number, ownerRating: number, bookRating: number, reviewContent: string): Promise<RentalResponse> {
    return api.post<RentalResponse>(`/rent_books/rate_owner_and_book/${rentalId}`, { ownerRating, bookRating, reviewContent })
      .then(res => res.data);
  }

  static async getReviewsByBookId(bookId: number): Promise<BookReview[]> {
    return api.get<BookReview[]>(`/rent_books/reviews/${bookId}`)
      .then(res => res.data);
  }

  static async bookComplain(bookId: number, complainDto: ComplainBookDto): Promise<void> {
    return api.post(`/rent_books/book_complain/${bookId}`, complainDto)
      .then(() => undefined);
  }
}

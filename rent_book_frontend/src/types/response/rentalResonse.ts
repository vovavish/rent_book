import { Condition } from "./bookResponse";

export interface CreateRentalDto {
  bookId: number;
  rentStartDate: string; // ISO 8601 формат даты, например "2025-04-02"
  rentEndDate: string;   // ISO 8601 формат даты, например "2025-04-02"
}

export interface RentalResponse {
  address: string;
  lat: number;
  lon: number;
  id: number;
  bookId: number;
  renterId: number;
  ownerId: number;
  status: RentalStatus;
  rentStartDate: string | null;
  rentEndDate: string | null;
  createdAt: string;
  updatedAt: string;
  price: number;
  pricePerDay: number; // Добавлено
  deposit: number | null; // Добавлено
  ownerRating: number | null; // Добавлено
  renterRating: number | null; // Добавлено
  bookRating: number | null; // Добавлено
  reviewContent: string | null;
  //кэш владельца
  ownerName: string;
  ownerLastname: string;
  ownerSurname?: string;
  ownerPhones: string[];
  ownerCardNumber: string;
  
  //кэш арендатора
  renterName: string;
  renterLastname: string;
  renterSurname?: string;
  renterPhones: string[];

  //Кэш книги
  bookTitle: string;
  bookAuthor: string;
  bookCoverImages: string[];
  bookCondition: Condition;
  bookLanguage: string;
  bookCategory: string;
  bookDescription: string;
  bookPublishedYear: number;

  book: {
    id: number;
    title: string;
    coverImagesUrls: string[];
    author: string;
  };
  renter: {
    id: number;
    name: string;
    lastname: string;
    surname?: string;
  };
  owner: {
    id: number;
    name: string;
    lastname: string;
    surname?: string;
  };
}

export enum RentalStatus {
  PENDING = 'PENDING',
  APPROVED_BY_OWNER = 'APPROVED_BY_OWNER',
  CONFIRMED = 'CONFIRMED',
  GIVEN_TO_READER = 'GIVEN_TO_READER',
  CANCELED = 'CANCELED',
  ACTIVE = 'ACTIVE',
  RETURN_APPROVAL = 'RETURN_APPROVAL',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

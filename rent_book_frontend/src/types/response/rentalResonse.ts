import { AgeRating, Category, Condition, Format, MaterialConstruction, Periodicity, Type } from "./bookResponse";

export interface CreateRentalDto {
  bookId: number;
  rentStartDate: string; // ISO 8601 формат даты, например "2025-04-02"
  rentEndDate: string;   // ISO 8601 формат даты, например "2025-04-02"
  message: string;
}

export interface RentalResponse {
  message: string;
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
  bookIsCashPayment: boolean;
  bookIsbn?: string;                              // ISBN (необязательный)
  bookIndexUDK?: string;                          // Индекс УДК (необязательный)
  bookIndexBBK?: string;                          // Индекс ББК (необязательный)
  bookIsnm?: string;                              // Индекс ИСНМ (необязательный)
  bookTitle: string;                              // Название
  bookFrequencyTitle?: string;                    // Частное название (например, выпуск серии)
  bookAuthor: string;                             // Автор
  bookPublisher: string;                          // Издательство
  bookPublishingCity: string;                     // Город издательства
  bookPublishedYear: number;                      // Год публикации
  bookPrintRun: number;                           // Тираж
  bookPages: number;                              // Количество страниц
  bookType: Type;                                 // Тип книги (например, журнал, книга)
  bookDescription: string;                        // Описание
  bookCondition: Condition;                       // Состояние книги
  bookAgeRestriction: AgeRating;                  // Возрастное ограничение
  bookPeriodicity?: Periodicity;                  // Периодичность (если журнал)
  bookMaterialConstruction?: MaterialConstruction;// Материальная конструкция
  bookFormat?: Format;                            // Формат книги
  bookEdition?: number;                           // Издание
  bookCategory: Category[];                       // Жанры/категории
  bookWeight?: number;                            // Вес книги (в граммах)
  bookLanguage?: string;                          // Язык
  bookCoverImages: string[];                      // Ссылки на обложки

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
    email: string;
    readerRating: number;
  };
  owner: {
    id: number;
    name: string;
    lastname: string;
    surname?: string;
    email: string;
    ownerRating: number;
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

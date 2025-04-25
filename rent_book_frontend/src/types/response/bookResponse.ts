import { IUser } from "../user";

export enum Condition {
  NEW = 'NEW',
  GOOD = 'GOOD',
  WORN = 'WORN',
  DAMAGED = 'DAMAGED',
}

export enum Format {
  HARDCOVER = 'HARDCOVER',
  PAPERBACK = 'PAPERBACK',
}

export enum BookStatus {
  ACTIVE = 'ACTIVE',
  RENTED = 'RENTED',
  CLOSED = 'CLOSED'
}

export interface CreateBookDto {
  title: string;
  condition: Condition;
  publishedYear: number;
  isbn: string;
  language: string;
  category: string;
  description: string;
  author: string;
  publisher?: string;
  series?: string;
  edition?: string;
  pages?: number;
  dimensions?: string;
  format?: Format;
  printRun?: number;
  weight?: number;
  ageRestriction?: string;
  price: number;
  deposit: number;
  minDaysToRent: number;
  cardNumber: string;
  availabilityStatus?: BookStatus;
  tags?: string[];
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface BookResponse {
  id: number;
  user: IUser;
  title: string;
  condition: Condition;
  publishedYear: number;
  isbn: string;
  language: string;
  category: string;
  description: string;
  author: string;
  publisher?: string;
  series?: string;
  edition?: string;
  pages?: number;
  dimensions?: string;
  format?: Format;
  printRun?: number;
  weight?: number;
  ageRestriction?: string;
  price: number;
  deposit: number;
  minDaysToRent: number;
  cardNumber: string;
  availabilityStatus: BookStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  coverImagesUrls: string[];
}
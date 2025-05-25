import { AgeRating, Category, Condition, Format, MaterialConstruction, Periodicity, Type } from "./bookResponse";

export interface BookSearchDto {
  query?: string;
  type?: Type | null;
  author?: string;
  category?: Category[] | null;
  publisher?: string;
  publishingCity?: string;
  publishedYear?: string;
  printRun?: string;
  minPages?: string;
  maxPages?: string;
  condition?: Condition;
  ageRestriction?: AgeRating;
  periodicity?: Periodicity;
  materialConstruction?: MaterialConstruction;
  format?: Format;
  edition?: number;
  language?: string;
  minPrice?: string;
  maxPrice?: string;
  minDeposit?: string;
  maxDeposit?: string;
  minDaysToRent?: string;
  maxDaysToRent?: string;
  address?: string;
  isCashPayment?: 'true' | 'false';
}

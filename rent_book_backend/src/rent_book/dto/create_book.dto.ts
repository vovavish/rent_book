import { IsString, IsInt, IsOptional, IsNumber, IsEnum, IsArray, Matches, IsPositive } from 'class-validator';
import { BookStatus, Condition, Type, Periodicity, MaterialConstruction, Format, AgeRating, Category } from '@prisma/client';

export class CreateBookDto {
  @IsString()
  isbn: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  frequencyTitle?: string;

  @IsString()
  author: string;

  @IsString()
  publisher: string;

  @IsString()
  publishingCity: string;

  @IsInt()
  publishedYear: number;

  @IsInt()
  @IsPositive()
  printRun: number;

  @IsInt()
  @IsPositive()
  pages: number;

  @IsEnum(Type)
  type: Type;

  @IsString()
  description: string;

  @IsEnum(Condition)
  condition: Condition;

  @IsEnum(AgeRating)
  ageRestriction: AgeRating;

  @IsEnum(Periodicity)
  @IsOptional()
  periodicity?: Periodicity;

  @IsEnum(MaterialConstruction)
  @IsOptional()
  materialConstruction?: MaterialConstruction;

  @IsEnum(Format)
  @IsOptional()
  format?: Format;

  @IsInt()
  @IsPositive()
  @IsOptional()
  edition?: number;

  @IsArray()
  @IsEnum(Category, ({ each: true }))
  category: Category[];

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  language?: string;

  @IsArray()
  @IsString({ each: true })
  coverImagesUrls: string[];

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  deposit?: number;

  @IsInt()
  @IsOptional()
  minDaysToRent?: number;

  @IsString()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;

  @IsString()
  @Matches(/^\d{16}$/, { message: 'Card number must be 16 digits' })
  @IsOptional()
  cardNumber?: string;

  @IsEnum(BookStatus)
  @IsOptional()
  availabilityStatus?: BookStatus;
}
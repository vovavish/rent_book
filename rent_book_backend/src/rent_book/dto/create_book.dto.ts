import { IsString, IsInt, IsOptional, IsNumber, IsEnum, IsArray, Matches, IsCreditCard } from 'class-validator';
import { BookStatus, Condition, Format } from '@prisma/client';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsEnum(Condition)
  condition: Condition;

  @IsInt()
  publishedYear: number;

  @IsString()
  isbn: string;

  @IsString()
  language: string;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  series?: string;

  @IsString()
  @IsOptional()
  edition?: string;

  @IsInt()
  @IsOptional()
  pages?: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsEnum(Format)
  @IsOptional()
  format?: Format;

  @IsInt()
  @IsOptional()
  printRun?: number;

  @IsInt()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  ageRestriction?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  deposit: number;

  @IsNumber()
  minDaysToRent: number;

  @IsString()
  @Matches(/^\d{16}$/, { each: true }) // Валидация 16 цифр
  @IsCreditCard({ each: true }) // Дополнительная проверка номера карты
  cardNumber: string;

  @IsEnum(BookStatus)
  @IsOptional()
  availabilityStatus?: BookStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
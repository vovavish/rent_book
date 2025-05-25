import { Category, Type, Condition, AgeRating, Periodicity, MaterialConstruction, Format, BookStatus } from '@prisma/client';
import { IsOptional, IsString, IsInt, IsBoolean, IsEnum, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';
import { Transform, Type as TypeCT } from 'class-transformer';
export class BookSearchDto {
  @IsOptional()
  @IsString()
  query?: string; // General search term for title, description, etc.

  @IsOptional()
  @IsEnum(Type)
  type?: Type;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Category, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  category?: Category[];

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  publishingCity?: string;

  @IsOptional()
  @IsInt()
  @TypeCT(() => Number)
  publishedYear?: number;

  @IsOptional()
  @IsInt()
  printRun?: number;

  @IsOptional()
  @IsInt()
  @TypeCT(() => Number)
  minPages?: number;

  @IsOptional()
  @IsInt()
  @TypeCT(() => Number)
  maxPages?: number;

  @IsOptional()
  @IsEnum(Condition)
  condition?: Condition;

  @IsOptional()
  @IsEnum(AgeRating)
  ageRestriction?: AgeRating;

  @IsOptional()
  @IsEnum(Periodicity)
  periodicity?: Periodicity;

  @IsOptional()
  @IsEnum(MaterialConstruction)
  materialConstruction?: MaterialConstruction;

  @IsOptional()
  @IsEnum(Format)
  format?: Format;

  @IsOptional()
  @IsInt()
  edition?: number;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  @TypeCT(() => Number)
  minPrice?: number;
  
  @IsOptional()
  @IsNumber()
  @TypeCT(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @TypeCT(() => Number)
  minDeposit?: number;

  @IsOptional()
  @IsNumber()
  @TypeCT(() => Number)
  maxDeposit?: number;

  @IsOptional()
  @IsInt()
  @TypeCT(() => Number)
  minDaysToRent?: number;

  @IsOptional()
  @IsInt()
  @TypeCT(() => Number)
  maxDaysToRent?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  @TypeCT(() => Boolean)
  isCashPayment?: boolean;
}
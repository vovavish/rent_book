import { IsInt, IsDateString, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsInt()
  bookId: number;

  @IsDateString()
  rentStartDate: string;

  @IsDateString()
  rentEndDate: string;

  @IsString()
  message: string;
}
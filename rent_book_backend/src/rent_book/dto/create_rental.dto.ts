import { IsInt, IsDateString } from 'class-validator';

export class CreateRentalDto {
  @IsInt()
  bookId: number;

  @IsDateString()
  rentStartDate: string;

  @IsDateString()
  rentEndDate: string;
}
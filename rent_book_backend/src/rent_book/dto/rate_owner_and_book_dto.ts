import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';

export class RateOwnerAndBookDto {
  @IsInt()
  @Min(1)
  @Max(5)
  ownerRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  bookRating: number;
  
  @IsString()
  @IsOptional()
  reviewContent?: string;
}
import { BookComplain } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class ComplainBookDto {
  @IsInt()
  @Min(1)
  bookId: number;

  @IsEnum(BookComplain)
  complain: BookComplain;

  @IsString()
  @IsOptional()
  message?: string
}
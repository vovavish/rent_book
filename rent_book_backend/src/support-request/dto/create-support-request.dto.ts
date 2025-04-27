import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSupportRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class CloseSupportRequestDto {
  @IsString()
  @IsNotEmpty()
  adminResponse: string;
}

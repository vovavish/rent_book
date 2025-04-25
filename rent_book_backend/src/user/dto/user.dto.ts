import { ArrayMaxSize, ArrayMinSize, IsArray, IsCreditCard, IsOptional, IsString, Matches, MaxLength } from "class-validator";

// user.dto.ts
export class UserDto {
  id: number;
  name: string;
  lastname: string;
  surname?: string;
  email: string;
  phoneNumbers: string[];
  cardNumbers: string[];
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Для обновления основной информации
export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  surname?: string;
}

// Для обновления телефонов
export class UpdatePhoneNumbersDto {
  @IsArray()
  @ArrayMaxSize(5) // Лимит на количество номеров
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^\+?\d{10,15}$/, { each: true }) // Валидация формата телефона
  phoneNumbers: string[];
}

// Для обновления карт
export class UpdateCardNumbersDto {
  @IsArray()
  @ArrayMaxSize(3) // Лимит на количество карт
  @IsString({ each: true })
  @Matches(/^\d{16}$/, { each: true }) // Валидация 16 цифр
  @IsCreditCard({ each: true }) // Дополнительная проверка номера карты
  cardNumbers: string[];
}
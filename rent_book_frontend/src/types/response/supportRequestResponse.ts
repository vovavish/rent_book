import { BookComplain } from "../complain/complain";
import { BookResponse } from "./bookResponse";
import { UserProfileResponse } from "./userResponse";

export enum SupportRequestStatus {
  REGISTERED = 'REGISTERED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

// Тип для ответа обращения
export interface SupportRequestResponse {
  id: number;
  title: string;
  content: string;
  user: UserProfileResponse;
  userId: number;
  status: SupportRequestStatus;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO для создания обращения
export interface CreateSupportRequestDto {
  title: string;
  content: string;
}

// DTO для установки статуса "В работе"
export interface UpdateSupportRequestStatusDto {
  status: SupportRequestStatus;
}

// DTO для закрытия обращения с ответом админа
export interface CloseSupportRequestDto {
  adminResponse: string;
}

export interface ComplainBookDto {
  id: number;
  reason: BookComplain;
  message?: string;
  book: BookResponse;
  user: UserProfileResponse;
  createdAt: string;
  updatedAt: string;
}
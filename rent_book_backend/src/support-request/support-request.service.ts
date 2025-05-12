import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestStatusDto } from './dto/update-support-request-status.dto';
import { CloseSupportRequestDto } from './dto/close-support-request.dto';
import { SupportRequestStatus } from '@prisma/client';

@Injectable()
export class SupportRequestService {
  constructor(private prisma: PrismaService) {}

  // Создание обращения
  async createRequest(
    userId: number,
    createSupportRequestDto: CreateSupportRequestDto,
  ) {
    return this.prisma.supportRequest.create({
      data: {
        title: createSupportRequestDto.title,
        content: createSupportRequestDto.content,
        userId,
        status: SupportRequestStatus.REGISTERED,
      },
      include: { user: true },
    });
  }

  // Получение активных обращений пользователя (ЗАРЕГЕСТРИРОВАНО и В РАБОТЕ)
  async getMyActiveRequests(userId: number) {
    return this.prisma.supportRequest.findMany({
      where: {
        userId,
        status: {
          in: [
            SupportRequestStatus.REGISTERED,
            SupportRequestStatus.IN_PROGRESS,
          ],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  // Получение закрытых обращений пользователя
  async getMyClosedRequests(userId: number) {
    return this.prisma.supportRequest.findMany({
      where: { userId, status: SupportRequestStatus.CLOSED },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  // Получение всех обращений (для админа)
  async getAllRequests() {
    return this.prisma.supportRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async getRequestsByStatus(status: SupportRequestStatus) {
    return this.prisma.supportRequest.findMany({
      where: { status: status },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  // Установка статуса "В работе"
  async setInProgress(
    requestId: number,
    updateSupportRequestStatusDto: UpdateSupportRequestStatusDto,
  ) {
    return this.prisma.supportRequest.update({
      where: { id: requestId },
      data: { status: SupportRequestStatus.IN_PROGRESS },
      include: { user: true },
    });
  }

  // Закрытие обращения с ответом админа
  async closeRequest(
    requestId: number,
    closeSupportRequestDto: CloseSupportRequestDto,
  ) {
    return this.prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        status: SupportRequestStatus.CLOSED,
        adminResponse: closeSupportRequestDto.adminResponse,
      },
      include: { user: true },
    });
  }

  async getComplains() {
    return this.prisma.bookComplaint.findMany(
      {
        orderBy: { createdAt: 'desc' },
        include: { book: true, user: true },
      },
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestStatusDto } from './dto/update-support-request-status.dto';
import { CloseSupportRequestDto } from './dto/close-support-request.dto';
import { AtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('support-requests')
export class SupportRequestController {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  // 1. Создание обращения (пользователь)
  @UseGuards(AtGuard)
  @Post('create')
  async createRequest(
    @GetCurrentUserId() userId: number,
    @Body() createSupportRequestDto: CreateSupportRequestDto,
  ) {
    return this.supportRequestService.createRequest(
      userId,
      createSupportRequestDto,
    );
  }

  // 2. Получение своих обращений в статусах ЗАРЕГЕСТРИРОВАНО и В РАБОТЕ (пользователь)
  @UseGuards(AtGuard)
  @Get('my/active')
  async getMyActiveRequests(
    @GetCurrentUserId() userId: number,
  ) {
    return this.supportRequestService.getMyActiveRequests(userId);
  }

  // 3. Получение своих обращений в статусе ЗАКРЫТО (пользователь
  @UseGuards(AtGuard)
  @Get('my/closed')
  async getMyClosedRequests(
    @GetCurrentUserId() userId: number,
  ) {
    return this.supportRequestService.getMyClosedRequests(userId);
  }

  // 4. Получение всех обращений (только админ)
  @UseGuards(AtGuard)
  @Roles(Role.Admin)
  @Get('all')
  async getAllRequests() {
    return this.supportRequestService.getAllRequests();
  }

  // Get REGISTERED requests (Admin only)
  @UseGuards(AtGuard)
  @Roles(Role.Admin)
  @Get('registered')
  async getRegisteredRequests() {
    return this.supportRequestService.getRequestsByStatus('REGISTERED');
  }

  // Get IN-PROGRESS requests (Admin only)
  @UseGuards(AtGuard)
  @Roles(Role.Admin)
  @Get('in-progress')
  async getInProgressRequests() {
    return this.supportRequestService.getRequestsByStatus('IN_PROGRESS');
  }

  // Get CLOSED requests (Admin only)
  @UseGuards(AtGuard)
  @Roles(Role.Admin)
  @Get('closed')
  async getClosedRequests() {
    return this.supportRequestService.getRequestsByStatus('CLOSED');
  }

  // 5. Изменение статуса обращения на "В работе" (только админ)
  @UseGuards(AtGuard)
  @Roles(Role.Admin)
  @Patch(':requestId/in-progress')
  async setInProgress(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() updateSupportRequestStatusDto: UpdateSupportRequestStatusDto,
  ) {
    return this.supportRequestService.setInProgress(
      requestId,
      updateSupportRequestStatusDto,
    );
  }

  // 6. Изменение статуса обращения на "ЗАКРЫТО" с ответом админа (только админ)
  @UseGuards(AtGuard)
  @Roles(Role.Admin)
  @Patch(':requestId/close')
  async closeRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() closeSupportRequestDto: CloseSupportRequestDto,
  ) {
    return this.supportRequestService.closeRequest(
      requestId,
      closeSupportRequestDto,
    );
  }
}

import { api } from './index';
import {
  SupportRequestResponse,
  CreateSupportRequestDto,
  UpdateSupportRequestStatusDto,
  CloseSupportRequestDto,
} from '../types/response/supportRequestResponse';

export default class ApiSupportRequestController {
  static async createRequest(
    createSupportRequestDto: CreateSupportRequestDto,
  ): Promise<SupportRequestResponse> {
    return api
      .post<SupportRequestResponse>('/support-requests/create', createSupportRequestDto)
      .then((res) => res.data);
  }

  static async getMyActiveRequests(): Promise<SupportRequestResponse[]> {
    return api.get<SupportRequestResponse[]>('/support-requests/my/active').then((res) => res.data);
  }

  static async getMyClosedRequests(): Promise<SupportRequestResponse[]> {
    return api.get<SupportRequestResponse[]>('/support-requests/my/closed').then((res) => res.data);
  }

  static async getAllRequests(): Promise<SupportRequestResponse[]> {
    return api.get<SupportRequestResponse[]>('/support-requests/all').then((res) => res.data);
  }

  static async getAllRegisteredRequests(): Promise<SupportRequestResponse[]> {
    return api.get<SupportRequestResponse[]>('/support-requests/registered').then((res) => res.data);
  }

  static async getAllInProgressRequests(): Promise<SupportRequestResponse[]> {
    return api.get<SupportRequestResponse[]>('/support-requests/in-progress').then((res) => res.data);
  }

  static async getAllClosedRequests(): Promise<SupportRequestResponse[]> {
    return api.get<SupportRequestResponse[]>('/support-requests/closed').then((res) => res.data);
  }

  static async setInProgress(
    requestId: number,
    updateSupportRequestStatusDto: UpdateSupportRequestStatusDto,
  ): Promise<SupportRequestResponse> {
    return api
      .patch<SupportRequestResponse>(
        `/support-requests/${requestId}/in-progress`,
        updateSupportRequestStatusDto,
      )
      .then((res) => res.data);
  }

  static async closeRequest(
    requestId: number,
    closeSupportRequestDto: CloseSupportRequestDto,
  ): Promise<SupportRequestResponse> {
    return api
      .patch<SupportRequestResponse>(`/support-requests/${requestId}/close`, closeSupportRequestDto)
      .then((res) => res.data);
  }
}

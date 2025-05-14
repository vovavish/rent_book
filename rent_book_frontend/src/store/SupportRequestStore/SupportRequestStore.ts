import ApiSupportRequestController from '../../api/ApiSupportRequestController';
import {
  SupportRequestResponse,
  CreateSupportRequestDto,
  UpdateSupportRequestStatusDto,
  CloseSupportRequestDto,
  ComplainBookDto,
} from '../../types/response/supportRequestResponse';
import { makeAutoObservable, runInAction } from 'mobx';

export class SupportRequestStore {
  private _activeRequests: SupportRequestResponse[] = [];
  private _closedRequests: SupportRequestResponse[] = [];
  private _allRequests: SupportRequestResponse[] = [];
  private _allRegisteredRequests: SupportRequestResponse[] = [];
  private _allInProgressRequests: SupportRequestResponse[] = [];
  private _allClosedRequests: SupportRequestResponse[] = [];
  private _currentRequest: SupportRequestResponse | null = null;
  private _complains: ComplainBookDto[] = [];

  private _isLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get activeRequests() {
    return this._activeRequests;
  }

  get closedRequests() {
    return this._closedRequests;
  }

  get allRequests() {
    return this._allRequests;
  }

  get allRegisteredRequests() {
    return this._allRegisteredRequests;
  }

  get allInProgressRequests() {
    return this._allInProgressRequests;
  }

  get allClosedRequests() {
    return this._allClosedRequests;
  }

  get currentRequest() {
    return this._currentRequest;
  }

  get complains() {
    return this._complains;
  }

  get isLoading() {
    return this._isLoading;
  }


  get error() {
    return this._error;
  }

  // Создание нового обращения
  async createRequest(createSupportRequestDto: CreateSupportRequestDto) {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.createRequest(createSupportRequestDto);
      runInAction(() => {
        this._activeRequests.push(response);
      });
      return response;
    }, 'Failed to create support request');
  }

  // Получение активных обращений пользователя
  async fetchActiveRequests() {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.getMyActiveRequests();

      runInAction(() => {
        this._activeRequests = response;
      })
    }, 'Failed to fetch active support requests');
  }

  // Получение закрытых обращений пользователя
  async fetchClosedRequests() {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.getMyClosedRequests();

      runInAction(() => {
        this._closedRequests = response;
      })
    }, 'Failed to fetch closed support requests');
  }

  // Получение всех обращений (для админа)
  async fetchAllRequests() {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.getAllRequests();

      runInAction(() => {
        this._allRequests = response;
      })
    }, 'Failed to fetch all support requests');
  }

  async fetchAllRegisteredRequests() {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.getAllRegisteredRequests();
      runInAction(() => {
        this._allRegisteredRequests = response;
      })
    }, 'Failed to fetch all registered support requests');
  }

  async fetchAllInProgressRequests() {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.getAllInProgressRequests();
      runInAction(() => {
        this._allInProgressRequests = response;
      })
    }, 'Failed to fetch all in progress support requests');
  }

  async fetchAllClosedRequests() {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.getAllClosedRequests();
      runInAction(() => {
        this._allClosedRequests = response;
      })
    }, 'Failed to fetch all closed support requests');
  }

  // Установка статуса "В работе" (для админа)
  async setInProgress(
    requestId: number,
    updateSupportRequestStatusDto: UpdateSupportRequestStatusDto,
  ) {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.setInProgress(
        requestId,
        updateSupportRequestStatusDto,
      );
      runInAction(() => {
        this._allRegisteredRequests = this._allRegisteredRequests.filter((req) => (req.id !== requestId));
      });
      return response;
    }, 'Failed to set request in progress');
  }

  // Закрытие обращения с ответом админа
  async closeRequest(requestId: number, closeSupportRequestDto: CloseSupportRequestDto) {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.closeRequest(
        requestId,
        closeSupportRequestDto,
      );
      runInAction(() => {
        this._allInProgressRequests = this._allInProgressRequests.filter((req) => (req.id !== requestId));
      });
      return response;
    }, 'Failed to close support request');
  }

  async fetchComplains() {
    await this.handleRequest(async () => {
      const response = await ApiSupportRequestController.getComplains();
      runInAction(() => {
        this._complains = response;
      })
    }, 'Failed to fetch complains');
  }

  private async handleRequest(requestFn: () => Promise<unknown>, errorMessage: string) {
    try {
      this._isLoading = true;
      this._error = null;
      return await requestFn();
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this._error = errorMessage;
      });
      throw e;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}

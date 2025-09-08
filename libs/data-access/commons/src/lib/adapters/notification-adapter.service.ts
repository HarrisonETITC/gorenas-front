import { Injectable } from "@angular/core";
import {
  NotificationServicePort,
  AppUtil
} from "@gorenas/application-core";
import {
  NotificationConfig,
  NotificationData
} from "@gorenas/domain";
import {
  BehaviorSubject,
  Observable,
  of
} from "rxjs";

export interface NotificationUIProvider {
  show(config: NotificationConfig, data?: NotificationData): void;
  close(): void;
}

@Injectable()
export class NotificationAdapter implements NotificationServicePort {
  private readonly buttonsAction = new BehaviorSubject<string>('');
  private actualConfig?: NotificationConfig;
  
  // Delegamos la implementación específica de UI a un provider externo
  private uiProvider?: NotificationUIProvider;

  setUIProvider(provider: NotificationUIProvider): void {
    this.uiProvider = provider;
  }

  showNotification(config: NotificationConfig, data?: NotificationData): void {
    this.actualConfig = config;
    
    if (!this.uiProvider) {
      throw new Error('UI Provider not configured');
    }
    
    this.uiProvider.show(config, data);
  }

  closeNotification(): void {
    this.uiProvider?.close();
  }

  sendButtonsResponse(response: string): void {
    this.buttonsAction.next(response);
  }

  buttonsResponse(): Observable<string> {
    if (AppUtil.verifyEmpty(this.actualConfig) || AppUtil.verifyEmpty(this.actualConfig?.buttons))
      return of('');

    return this.buttonsAction.asObservable();
  }
}

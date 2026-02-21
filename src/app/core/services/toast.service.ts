import { Injectable, signal } from '@angular/core';

import { ToastMessage, ToastVariant } from '../models/toast.model';

type ToastOptions = Omit<ToastMessage, 'id' | 'variant'> & {
  id?: string;
  variant?: ToastVariant;
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _messages = signal<ToastMessage[]>([]);
  private readonly dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly messages = this._messages.asReadonly();

  success(title: string, message: string, duration = 3200): string {
    return this.show({ title, message, duration, variant: 'success' });
  }

  error(title: string, message: string, duration = 4400): string {
    return this.show({ title, message, duration, variant: 'error' });
  }

  info(title: string, message: string, duration = 2800): string {
    return this.show({ title, message, duration, variant: 'info' });
  }

  warning(title: string, message: string, duration = 3600): string {
    return this.show({ title, message, duration, variant: 'warning' });
  }

  dismiss(id: string): void {
    const timer = this.dismissTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.dismissTimers.delete(id);
    }

    this._messages.update((messages) => messages.filter((message) => message.id !== id));
  }

  clear(): void {
    this.dismissTimers.forEach((timer) => clearTimeout(timer));
    this.dismissTimers.clear();
    this._messages.set([]);
  }

  private show(options: ToastOptions): string {
    const id = options.id ?? crypto.randomUUID();

    const toast: ToastMessage = {
      id,
      title: options.title,
      message: options.message,
      duration: options.duration,
      variant: options.variant ?? 'info'
    };

    this._messages.update((messages) => [...messages, toast]);

    if (toast.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), toast.duration);
      this.dismissTimers.set(id, timer);
    }

    return id;
  }
}

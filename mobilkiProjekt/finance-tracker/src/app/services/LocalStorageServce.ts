import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && !!window.localStorage;
  }

  save(key: string, value: any): void {
    if (this.isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  load<T>(key: string): T | null {
    if (this.isBrowser) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  remove(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  exists(key: string): boolean {
    return this.isBrowser && localStorage.getItem(key) !== null;
  }
}

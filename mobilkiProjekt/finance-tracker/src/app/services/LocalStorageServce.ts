import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  save(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  load<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

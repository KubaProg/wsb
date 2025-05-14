// === budget.service.ts ===
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './LocalStorageServce';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly API_URL = 'http://localhost:4000/api/budget';
  private readonly STORAGE_KEY = 'monthlyBudget';
  private readonly PENDING_KEY = 'pending-budget';

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  private getMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

loadBudget(): Observable<number> {
  const month = this.getMonthKey();

  if (!navigator.onLine) {
    console.warn('⚠️ Offline – używam lokalnego budżetu');
    const local = this.localStorage.load<{ amount: number, month: string }>(this.STORAGE_KEY);
    return of(local?.amount || 0);
  }

  return this.http.get<{ amount: number }>(`${this.API_URL}/${month}`).pipe(
    tap(data => this.localStorage.save(this.STORAGE_KEY, { ...data, month })),
    map(data => data.amount),
    catchError(() => {
      console.warn('⚠️ Błąd pobierania budżetu – fallback do localStorage');
      const local = this.localStorage.load<{ amount: number, month: string }>(this.STORAGE_KEY);
      return of(local?.amount || 0);
    })
  );
}


  saveBudget(amount: number): Observable<any> {
    const month = this.getMonthKey();
    const payload = { month, amount };

    this.localStorage.save(this.STORAGE_KEY, payload);

    if (navigator.onLine) {
      return this.http.post(this.API_URL, payload).pipe(
        tap(() => this.localStorage.remove(this.PENDING_KEY))
      );
    } else {
      console.warn('⛔ Brak połączenia – zapisuję budżet lokalnie');
      this.localStorage.save(this.PENDING_KEY, payload);
      return of(payload);
    }
  }

  syncPendingBudget(): void {
    if (!navigator.onLine) return;

    const pending = this.localStorage.load<{ month: string, amount: number }>(this.PENDING_KEY);
    if (!pending) return;

    this.http.post(this.API_URL, pending).subscribe({
      next: () => {
        console.log('✅ Budżet zsynchronizowany');
        this.localStorage.remove(this.PENDING_KEY);
      },
      error: err => console.error('❌ Błąd synchronizacji budżetu:', err)
    });
  }
}

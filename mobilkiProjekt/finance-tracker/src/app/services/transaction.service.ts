import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from '../models/Transaction';
import { LocalStorageService } from './LocalStorageServce';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly API_URL = 'http://localhost:4000/api/transactions';
  private readonly LOCAL_KEY = 'transactions';
  private readonly PENDING_KEY = 'pending-transactions';

  public transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  loadTransactions(): void {
    if (!navigator.onLine) {
      console.warn('⚠️ Offline – używam danych z localStorage');
      const local = this.localStorage.load<Transaction[]>(this.LOCAL_KEY) || [];
      this.transactionsSubject.next(local);
      return;
    }

    this.http.get<Transaction[]>(this.API_URL).pipe(
      tap(data => {
        this.localStorage.save(this.LOCAL_KEY, data);
        this.transactionsSubject.next(data);
      }),
      catchError(() => {
        console.warn('⚠️ Błąd pobierania – fallback do localStorage');
        const local = this.localStorage.load<Transaction[]>(this.LOCAL_KEY) || [];
        this.transactionsSubject.next(local);
        return of([]);
      })
    ).subscribe();
  }

  addTransaction(tx: Transaction): Observable<Transaction> {
    if (!navigator.onLine) {
      console.warn('⛔ Brak połączenia – zapisuję lokalnie (offline)');
      const pending = this.localStorage.load<Transaction[]>(this.PENDING_KEY) || [];
      this.localStorage.save(this.PENDING_KEY, [...pending, tx]);

      const current = this.transactionsSubject.getValue();
      this.transactionsSubject.next([...current, tx]);

      return of(tx);
    }

    return this.http.post<Transaction>(this.API_URL, tx).pipe(
      tap(() => this.loadTransactions()),
      catchError(err => {
        console.warn('⚠️ Błąd zapisu — fallback do localStorage', err);
        const pending = this.localStorage.load<Transaction[]>(this.PENDING_KEY) || [];
        this.localStorage.save(this.PENDING_KEY, [...pending, tx]);

        const current = this.transactionsSubject.getValue();
        this.transactionsSubject.next([...current, tx]);

        return of(tx);
      })
    );
  }

  syncPendingTransactions(): void {
    const pending = this.localStorage.load<Transaction[]>(this.PENDING_KEY) || [];
    if (pending.length === 0 || !navigator.onLine) return;

    const uploads = pending.map(tx => this.http.post<Transaction>(this.API_URL, tx));
    Promise.all(uploads.map(req => req.toPromise())).then(() => {
      console.log('✅ Zsynchronizowano oczekujące transakcje');
      this.localStorage.remove(this.PENDING_KEY);
      this.loadTransactions();
    }).catch(err => {
      console.error('❌ Błąd synchronizacji:', err);
    });
  }
}

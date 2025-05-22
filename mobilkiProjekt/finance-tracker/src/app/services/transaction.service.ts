import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from '../models/Transaction';
import { LocalStorageService } from './LocalStorageServce';
import { v4 as uuidv4 } from 'uuid';

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
      tap(serverData => {
        const pending = this.localStorage.load<Transaction[]>(this.PENDING_KEY) || [];
        const merged = this.mergeTransactions(serverData, pending);

        this.localStorage.save(this.LOCAL_KEY, merged);
        this.transactionsSubject.next(merged);
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
    const txWithId = { ...tx, id: tx.id || uuidv4() };

    if (!navigator.onLine) {
      console.warn('⛔ Offline – zapisuję lokalnie');
      const pending = this.localStorage.load<Transaction[]>(this.PENDING_KEY) || [];
      const updatedPending = [...pending, txWithId];

      this.localStorage.save(this.PENDING_KEY, updatedPending);
      const local = this.localStorage.load<Transaction[]>(this.LOCAL_KEY) || [];
      this.localStorage.save(this.LOCAL_KEY, [...local, txWithId]);
      this.transactionsSubject.next([...local, txWithId]);

      return of(txWithId);
    }

    return this.http.post<Transaction>(this.API_URL, txWithId).pipe(
      tap(() => {
        this.loadTransactions(); // zamiast ręcznego dodania
      }),
      catchError(err => {
        console.warn('❌ Błąd zapisu – fallback do localStorage');
        const pending = this.localStorage.load<Transaction[]>(this.PENDING_KEY) || [];
        this.localStorage.save(this.PENDING_KEY, [...pending, txWithId]);

        const local = this.localStorage.load<Transaction[]>(this.LOCAL_KEY) || [];
        this.localStorage.save(this.LOCAL_KEY, [...local, txWithId]);
        this.transactionsSubject.next([...local, txWithId]);

        return of(txWithId);
      })
    );
  }

  syncPendingTransactions(): void {
    const pending = this.localStorage.load<Transaction[]>(this.PENDING_KEY) || [];
    if (!navigator.onLine || pending.length === 0) return;

    const uploads = pending.map(tx => this.http.post<Transaction>(this.API_URL, tx).toPromise());

    Promise.all(uploads).then(savedList => {
      const serverData = this.transactionsSubject.getValue().filter(t => !pending.some(p => p.id === t.id));
      const all = [...serverData, ...savedList.filter((t): t is Transaction => !!t)];

      this.localStorage.save(this.LOCAL_KEY, all);
      this.localStorage.remove(this.PENDING_KEY);
      this.transactionsSubject.next(all);
      console.log('✅ Zsynchronizowano pending transakcje bez duplikacji');
    }).catch(err => {
      console.error('❌ Błąd synchronizacji:', err);
    });
  }

  private mergeTransactions(server: Transaction[], pending: Transaction[]): Transaction[] {
    const existingIds = new Set(server.map(t => t.id));
    const filteredPending = pending.filter(t => !existingIds.has(t.id));
    return [...server, ...filteredPending];
  }
}

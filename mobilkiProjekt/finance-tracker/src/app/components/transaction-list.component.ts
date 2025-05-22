import { Component, OnInit } from '@angular/core';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
  <h2 class="card-title">📜 Lista transakcji</h2>
  <ul class="transaction-list">
    <li *ngFor="let tx of transactions">
      {{ tx.date | date:'shortDate' }} |
      {{ tx.type === 'income' ? '💰' : '💸' }}
      {{ tx.category }} – {{ tx.amount }} zł
    </li>
  </ul>
</div>
  `
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe(data => {
      this.transactions = data;
    });

    this.transactionService.loadTransactions();

    // jeśli online – synchronizuj
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.transactionService.syncPendingTransactions();
    }
    
  }
}

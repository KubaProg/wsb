import { Component, OnInit } from '@angular/core';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>📜 Lista transakcji</h2>
    <ul>
      <li *ngFor="let tx of transactions">
        {{ tx.date | date:'shortDate' }} | 
        {{ tx.type === 'income' ? '💰' : '💸' }} 
        {{ tx.category }} – {{ tx.amount }} zł
      </li>
    </ul>
  `,
  styles: [`
    h2 {
      margin: 10px 0;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 6px 0;
      border-bottom: 1px solid #ddd;
    }
  `]
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

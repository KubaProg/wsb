import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../services/transaction.service';

@Component({
  standalone: true,
  selector: 'app-report',
  imports: [CommonModule],
  template: `
    <div class="card report">
  <h2 class="card-title">📊 Raport finansowy</h2>
  <div class="report-item">
    <span>📈 Przychody:</span>
    <strong>{{ income }} zł</strong>
  </div>
  <div class="report-item">
    <span>📉 Wydatki:</span>
    <strong>{{ expense }} zł</strong>
  </div>
  <div class="report-item balance" [ngClass]="{ negative: balance < 0, positive: balance >= 0 }">
    <span>🧮 Saldo:</span>
    <strong>{{ balance }} zł</strong>
  </div>
</div>
  `
})
export class ReportComponent {
  income = 0;
  expense = 0;
  balance = 0;

  constructor(private txService: TransactionService) {
    this.txService.transactions$.subscribe(txs => {
      this.income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      this.expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      this.balance = this.income - this.expense;
    });

    this.txService.loadTransactions();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../services/transaction.service';

@Component({
  standalone: true,
  selector: 'app-report',
  imports: [CommonModule],
  template: `
    <div class="report-container">
      <h2>📊 Raport finansowy</h2>

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
  `,
  styles: [`
    .report-container {
      margin: 20px auto;
      max-width: 400px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }

    .report-item {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      font-size: 18px;
    }

    .balance {
      font-weight: bold;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      margin-top: 20px;
    }

    .positive {
      color: #4caf50;
    }

    .negative {
      color: #f44336;
    }
  `]
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

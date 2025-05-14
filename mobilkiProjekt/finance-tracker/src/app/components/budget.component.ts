// === budget.component.ts ===
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TransactionService } from "../services/transaction.service";
import { BudgetService } from "../services/budget.service";

@Component({
  standalone: true,
  selector: 'app-budget',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="budget-container">
      <h2>🎯 Miesięczny budżet</h2>

      <label>
        Ustaw budżet:
        <input type="number" [(ngModel)]="monthlyBudget" (change)="onBudgetChange()" />
      </label>

      <p>📆 Dziś: {{ today | date:'dd.MM.yyyy' }}</p>
      <p>📅 Pozostałe dni w miesiącu: {{ daysLeft }}</p>

      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="progressPercent" [ngClass]="{
          'low': progressPercent < 50,
          'medium': progressPercent >= 50 && progressPercent < 90,
          'high': progressPercent >= 90
        }"></div>
      </div>

      <p>💸 Wydano: {{ spent }} zł</p>
      <p>💼 Pozostało: {{ remaining }} zł</p>

      <p *ngIf="daysLeft > 0 && remaining > 0">
        🧠 Możesz wydawać około <strong>{{ (remaining / daysLeft) | number:'1.0-2' }} zł</strong> dziennie.
      </p>
    </div>
  `,
  styles: [`
    .budget-container {
      margin: 20px auto;
      max-width: 400px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    h2 {
      margin-bottom: 20px;
      text-align: center;
    }

    label {
      display: block;
      margin-bottom: 10px;
    }

    input {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }

    .progress-bar {
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin: 15px 0;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.4s ease;
    }

    .progress-fill.low {
      background-color: #4caf50;
    }

    .progress-fill.medium {
      background-color: #ff9800;
    }

    .progress-fill.high {
      background-color: #f44336;
    }

    p {
      font-size: 16px;
      margin-top: 10px;
    }
  `]
})
export class BudgetComponent {
  monthlyBudget = 0;
  spent = 0;
  remaining = 0;
  today = new Date();
  daysLeft = 0;
  progressPercent = 0;

  constructor(
    private txService: TransactionService,
    private budgetService: BudgetService
  ) {
    this.calculateDaysLeft();

    // Załaduj budżet (MongoDB lub localStorage)
    this.budgetService.loadBudget().subscribe(budget => {
      this.monthlyBudget = budget;
      this.recalculate();
    });

    // Reaguj na zmiany w transakcjach
    this.txService.transactions$.subscribe(() => {
      this.recalculate();
    });

    this.txService.loadTransactions();
  }

  onBudgetChange() {
    this.budgetService.saveBudget(this.monthlyBudget).subscribe(() => {
      this.recalculate();
    });
  }

  private recalculate() {
    const transactions = this.txService.transactionsSubject.getValue();
    this.spent = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    this.remaining = this.monthlyBudget - this.spent;
    this.progressPercent = Math.min(100, (this.spent / this.monthlyBudget) * 100);
  }

  private calculateDaysLeft() {
    const lastDay = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
    this.daysLeft = lastDay.getDate() - this.today.getDate();
  }
}

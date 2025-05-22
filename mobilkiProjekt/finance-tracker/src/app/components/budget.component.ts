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
   <div class="card budget">
  <h2 class="card-title">🎯 Miesięczny budżet</h2>
  <label class="form-label">
    Ustaw budżet:
    <input type="number" [(ngModel)]="monthlyBudget" (change)="onBudgetChange()" class="form-control" />
  </label>
  <div class="info-text">📆 Dziś: {{ today | date:'dd.MM.yyyy' }}</div>
  <div class="info-text">📅 Pozostałe dni w miesiącu: {{ daysLeft }}</div>
  <div class="progress">
    <div class="progress-bar" [style.width.%]="progressPercent" [ngClass]="{
      'bg-success': progressPercent < 50,
      'bg-warning': progressPercent >= 50 && progressPercent < 90,
      'bg-danger': progressPercent >= 90
    }"></div>
  </div>
  <div class="info-text">💸 Wydano: {{ spent }} zł</div>
  <div class="info-text">💼 Pozostało: {{ remaining }} zł</div>
  <div *ngIf="daysLeft > 0 && remaining > 0" class="daily-budget">
    🧠 Możesz wydawać około <strong>{{ (remaining / daysLeft) | number:'1.0-2' }} zł</strong> dziennie.
  </div>
</div>

  `
  
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

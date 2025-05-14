import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../models/Transaction';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="tx-form">
      <select formControlName="type">
        <option value="income">Przychód</option>
        <option value="expense">Wydatek</option>
      </select>
      <input formControlName="category" placeholder="Kategoria" />
      <input type="number" formControlName="amount" placeholder="Kwota" />
      <input type="date" formControlName="date" />
      <button type="submit">Zapisz</button>
    </form>
  `,
  styles: [`
    .tx-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      margin: auto;
    }
    input, select, button {
      padding: 8px;
      font-size: 16px;
    }
    button {
      background-color: #4caf50;
      color: white;
      border: none;
      cursor: pointer;
    }
  `]
})
export class TransactionFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private txService: TransactionService) {
    this.form = this.fb.group({
      type: ['income'],
      category: [''],
      amount: [0],
      date: [new Date().toISOString().split('T')[0]],
      note: ['']
    });
  }

  submit() {
    const tx: Transaction = this.form.value;
    this.txService.addTransaction(tx).subscribe(() => {
      alert('✅ Transakcja dodana!');
      this.form.reset({ type: 'income', amount: 0, date: new Date().toISOString().split('T')[0] });
    });
  }
}

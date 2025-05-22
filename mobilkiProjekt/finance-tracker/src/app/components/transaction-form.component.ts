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
   <form [formGroup]="form" (ngSubmit)="submit()" class="form tx-form">
  <select formControlName="type" class="form-control">
    <option value="income">Przychód</option>
    <option value="expense">Wydatek</option>
  </select>
  <input formControlName="category" placeholder="Kategoria" class="form-control" />
  <input type="number" formControlName="amount" placeholder="Kwota" class="form-control" />
  <input type="date" formControlName="date" class="form-control" />
  <button type="submit" class="btn btn-primary">Zapisz</button>
</form>
  `
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

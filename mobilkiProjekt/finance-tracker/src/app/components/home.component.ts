import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from './transaction-form.component';
import { TransactionListComponent } from './transaction-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TransactionFormComponent,
    TransactionListComponent
  ],
  template: `

    <h2>📘 Moje transakcje</h2>
    <app-transaction-form></app-transaction-form>
    <app-transaction-list></app-transaction-list>
  `,
  styles: [`
    nav button {
      margin-right: 10px;
      padding: 6px 12px;
      font-size: 14px;
    }

    h2 {
      margin: 20px 0;
      color: #444;
    }
  `]
})
export class HomeComponent {}

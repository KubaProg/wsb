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

    <div class="home">
  <h2 class="card-title">📘 Moje transakcje</h2>
  <app-transaction-form></app-transaction-form>
  <app-transaction-list></app-transaction-list>
</div>
  `
})
export class HomeComponent {}

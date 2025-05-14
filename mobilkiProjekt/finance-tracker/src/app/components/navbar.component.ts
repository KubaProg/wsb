import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/">🏠 Transakcje</a>
      <a routerLink="/budget">💰 Budżet</a>
      <a routerLink="/report">📊 Raporty</a>
      <a routerLink="/analysis">📈 Analiza</a>
    </nav>
  `,
  styles: [`
    nav {
      display: flex;
      gap: 20px;
      background-color: #f5f5f5;
      padding: 10px 20px;
      border-bottom: 1px solid #ccc;
    }
    a {
      text-decoration: none;
      font-weight: bold;
      color: #333;
    }
    a:hover {
      color: #007BFF;
    }
  `]
})
export class NavbarComponent {}

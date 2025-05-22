import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="navbar">
      <div class="navbar-brand">💸 FinTrack</div>
      <nav class="navbar-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">🏠 Transakcje</a>
        <a routerLink="/budget" routerLinkActive="active">💰 Budżet</a>
        <a routerLink="/report" routerLinkActive="active">📊 Raporty</a>
        <a routerLink="/analysis" routerLinkActive="active">📈 Analiza</a>
      </nav>
    </header>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background-color: #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-brand {
      font-size: 20px;
      font-weight: bold;
      color: #007BFF;
    }

    .navbar-links {
      display: flex;
      gap: 15px;
    }

    .navbar-links a {
      text-decoration: none;
      font-weight: 500;
      color: #333;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background-color 0.2s, color 0.2s;
    }

    .navbar-links a:hover {
      background-color: #f0f0f0;
      color: #007BFF;
    }

    .navbar-links a.active {
      background-color: #007BFF;
      color: #fff;
    }

    @media screen and (max-width: 600px) {
      .navbar {
        flex-direction: column;
        align-items: flex-start;
      }

      .navbar-links {
        flex-direction: column;
        width: 100%;
      }

      .navbar-links a {
        width: 100%;
      }
    }
  `]
})
export class NavbarComponent {}

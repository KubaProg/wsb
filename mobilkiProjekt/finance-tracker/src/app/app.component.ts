import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { TransactionFormComponent } from "./components/transaction-form.component";
import { TransactionListComponent } from "./components/transaction-list.component";
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "./components/navbar.component";
import { RouterOutlet } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { TransactionService } from './services/transaction.service';
import { BudgetService } from './services/budget.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    NavbarComponent,
    RouterOutlet,
    TransactionFormComponent,
    TransactionListComponent,
    NgChartsModule
],  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly VAPID_PUBLIC_KEY = 'BJBS8ADWnHOcp38K6M5V-ej6PvMFTJPCKht_qkmp0K4vVEzHybkjnUU6mcO-SJaj5STyDrRqAwTEc9yB0wWGZnk';

  constructor(private swPush: SwPush, private http: HttpClient,  private txService: TransactionService,
  private budgetService: BudgetService) {

      if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      this.txService.syncPendingTransactions();
      this.budgetService.syncPendingBudget();
    });
  }

  }

  enablePushNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(subscription => {
      this.http.post('http://localhost:4000/api/subscribe', subscription)
        .subscribe(() => {
          alert('✅ Subskrybowano powiadomienia push!');
        });
    }).catch(err => {
      console.error('❌ Subskrypcja nie powiodła się:', err);
    });
  }

  sendTestNotification() {
  this.http.post('http://localhost:4000/api/subscribe/test', {}).subscribe(() => {
    console.log('✅ Testowe powiadomienie wysłane');
  });
}


}

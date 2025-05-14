import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ReportComponent } from './components/report.component';
import { BudgetComponent } from './components/budget.component';
import { ChartAnalysisComponent } from './components/chart-analysis.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'report', component: ReportComponent },
  { path: 'analysis', component: ChartAnalysisComponent }, // <-- dodaj to
];

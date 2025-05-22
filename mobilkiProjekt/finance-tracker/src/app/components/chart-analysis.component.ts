import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../models/Transaction';

@Component({
  standalone: true,
  selector: 'app-chart-analysis',
  imports: [CommonModule, FormsModule, NgChartsModule],
  template: `
   <div class="card analysis">
  <h2 class="card-title">📈 Analiza finansowa</h2>
  <label class="form-label">
    Filtruj miesiąc:
    <select [(ngModel)]="selectedMonth" (change)="updateCharts()" class="form-control">
      <option *ngFor="let month of availableMonths" [value]="month">{{ month }}</option>
    </select>
  </label>
  <h3 class="chart-header">📊 Przychody vs Wydatki</h3>
  <canvas baseChart [type]="'pie'" [data]="pieChartData" [options]="chartOptions"></canvas>
  <h3 class="chart-header">📦 Kategorie</h3>
  <canvas baseChart [type]="'bar'" [data]="barChartData" [options]="chartOptions"></canvas>
  <h3 class="chart-header">📅 Trend dzienny</h3>
  <canvas baseChart [type]="'line'" [data]="lineChartData" [options]="chartOptions"></canvas>
</div>
  `
})
export class ChartAnalysisComponent {
  selectedMonth: string = this.formatMonth(new Date());
  availableMonths: string[] = [];

  pieChartData: ChartData<'pie', number[], string[]> = {
    labels: [['Przychody'], ['Wydatki']],
    datasets: [{ data: [0, 0], backgroundColor: ['#4caf50', '#f44336'] }]
  };

  barChartData: ChartData<'bar', number[], string[]> = {
    labels: [],
    datasets: [{ label: 'Kwota', data: [], backgroundColor: '#2196f3' }]
  };
  
  lineChartData: ChartData<'line', number[], string[]> = {
    labels: [],
    datasets: [{ label: 'Suma dzienna', data: [], borderColor: '#9c27b0', fill: false }]
  };
  
  

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  private allTransactions: Transaction[] = [];

  constructor(private txService: TransactionService) {
    this.txService.transactions$.subscribe(txs => {
      this.allTransactions = txs;
      this.availableMonths = [...new Set(txs.map(t => this.formatMonth(new Date(t.date))))];
      this.updateCharts();
    });

    this.txService.loadTransactions();
  }

  updateCharts() {
    const filtered = this.allTransactions.filter(t =>
      this.formatMonth(new Date(t.date)) === this.selectedMonth
    );

    // Pie chart
    const income = filtered.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    this.pieChartData.datasets[0].data = [income, expense];

    // Bar chart by category
    const categoryMap: Record<string, number> = {};
    filtered.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
      this.barChartData.labels = Object.keys(categoryMap).map(label => [label]);
      this.barChartData.datasets[0].data = Object.values(categoryMap);

    // Line chart by day
    const dayMap: Record<string, number> = {};
    filtered.forEach(t => {
      const day = new Date(t.date).toISOString().split('T')[0];
      dayMap[day] = (dayMap[day] || 0) + t.amount;
    });
    const sortedDays = Object.keys(dayMap).sort();
      this.lineChartData.labels = sortedDays.map(day => [day]);
      this.lineChartData.datasets[0].data = sortedDays.map(day => dayMap[day]);
  }

  private formatMonth(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}

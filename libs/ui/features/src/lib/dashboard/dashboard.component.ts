import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ApplicationServicePort, APPLICATION_SERVICE, StatsServicePort, STATS_SERVICE } from '@gorenas/application-core';
import { BranchSalesStats, EmployeeSalesStats, PaymentMethodStats } from '@gorenas/domain';
import { StatsProviders } from '@gorenas/data-access-features';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DebugLogger } from '@gorenas/shared-util-forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [...StatsProviders]
})
export class DashboardComponent implements OnInit {
  employeesWithMostAmount$: Observable<Array<EmployeeSalesStats>>;
  employeesWithMostSales$: Observable<Array<EmployeeSalesStats>>;
  branchesWithMostSales$: Observable<Array<BranchSalesStats>>;
  paymentMethodStats$: Observable<PaymentMethodStats>;

  // Chart.js configuration for pie chart
  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Efectivo', 'Débito', 'Crédito', 'Transferencia', 'Plataformas'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        '#22c55e', // green-500 - Efectivo
        '#3b82f6', // blue-500 - Débito
        '#a855f7', // purple-500 - Crédito
        '#eab308', // yellow-500 - Transferencia
        '#f97316', // orange-500 - Plataformas
      ],
      borderColor: '#9ca3af',
      borderWidth: 2
    }]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 8,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            return `${context.label}: ${value.toFixed(1)}%`;
          }
        }
      }
    }
  };

  constructor(
    @Inject(APPLICATION_SERVICE)
    private readonly appService: ApplicationServicePort,
    @Inject(STATS_SERVICE)
    private readonly statsService: StatsServicePort
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.employeesWithMostAmount$ = this.statsService.getEmployeesWithMostAmountSold();
    this.employeesWithMostSales$ = this.statsService.getEmployeesWithMostSales();
    this.branchesWithMostSales$ = this.statsService.getBranchesWithMostSales();
    this.paymentMethodStats$ = this.statsService.getPercentageOfSalesByPaymentMethod();
    
    // Subscribe to update pie chart data when stats arrive
    this.paymentMethodStats$.subscribe(stats => {
      DebugLogger.log('[Dashboard] Payment Method Stats:', stats);
      
      // Update pie chart data
      this.pieChartData = {
        ...this.pieChartData,
        datasets: [{
          ...this.pieChartData.datasets[0],
          data: [
            stats.cashSalesRatio ?? 0,
            stats.debitSalesRatio ?? 0,
            stats.creditSalesRatio ?? 0,
            stats.transferenceSalesRatio ?? 0,
            stats.platformsSalesRatio ?? 0
          ]
        }]
      };
    });
  }
}


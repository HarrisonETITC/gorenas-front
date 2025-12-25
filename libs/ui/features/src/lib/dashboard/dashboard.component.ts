import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ApplicationServicePort, APPLICATION_SERVICE, StatsServicePort, STATS_SERVICE } from '@gorenas/application-core';
import { BranchSalesStats, EmployeeSalesStats, PaymentMethodStats } from '@gorenas/domain';
import { StatsProviders } from '@gorenas/data-access-features';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DebugLogger } from '@gorenas/shared-util-forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [...StatsProviders]
})
export class DashboardComponent implements OnInit {
  employeesWithMostAmount$: Observable<Array<EmployeeSalesStats>>;
  employeesWithMostSales$: Observable<Array<EmployeeSalesStats>>;
  branchesWithMostSales$: Observable<Array<BranchSalesStats>>;
  paymentMethodStats$: Observable<PaymentMethodStats>;

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
    
    // Debug: Ver qué datos llegan del backend
    this.paymentMethodStats$.subscribe(stats => {
      DebugLogger.log('[Dashboard] Payment Method Stats:', stats);
      DebugLogger.log('[Dashboard] cashSalesRatio:', stats.cashSalesRatio);
      DebugLogger.log('[Dashboard] debitSalesRatio:', stats.debitSalesRatio);
    });
  }
}


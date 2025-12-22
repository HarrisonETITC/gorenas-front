import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { API_URL_TOKEN, StatsServicePort } from "@gorenas/application-core";
import { BranchSalesStats, EmployeeSalesStats, PaymentMethodStats } from "@gorenas/domain";
import { URL_STATS } from "@gorenas/application-core";

/**
 * Stats service adapter implementation
 * Handles HTTP requests for statistics endpoints
 */
@Injectable()
export class StatsServiceAdapter implements StatsServicePort {
    private readonly baseUrl: string;

    constructor(
        private readonly http: HttpClient
    ) {
        const apiUrl = inject(API_URL_TOKEN);
        this.baseUrl = `${apiUrl}/${URL_STATS}/`;
    }

    /**
     * Get employees with the highest sales amount
     */
    getEmployeesWithMostAmountSold(): Observable<Array<EmployeeSalesStats>> {
        return this.http.get<Array<EmployeeSalesStats>>(`${this.baseUrl}employees-with-most-amount-sold`);
    }

    /**
     * Get employees with the most number of sales
     */
    getEmployeesWithMostSales(): Observable<Array<EmployeeSalesStats>> {
        return this.http.get<Array<EmployeeSalesStats>>(`${this.baseUrl}employees-with-most-sales`);
    }

    /**
     * Get branches with the most sales
     */
    getBranchesWithMostSales(): Observable<Array<BranchSalesStats>> {
        return this.http.get<Array<BranchSalesStats>>(`${this.baseUrl}branches-with-most-sales`);
    }

    /**
     * Get percentage of sales by payment method
     * Note: Backend returns an array with a single object, we extract it and parse strings to numbers
     */
    getPercentageOfSalesByPaymentMethod(): Observable<PaymentMethodStats> {
        return this.http.get<Array<any>>(`${this.baseUrl}percentage-of-sales-by-payment-method`).pipe(
            map(response => {
                // Backend returns an array with one object, take the first element
                const data = response[0] || {};
                
                // Parse string values to numbers
                const stats: PaymentMethodStats = {
                    totalSales: parseInt(data.totalSales) || 0,
                    debitSalesRatio: parseFloat(data.debitSalesRatio) || 0,
                    platformsSalesRatio: parseFloat(data.platformsSalesRatio) || 0,
                    cashSalesRatio: parseFloat(data.cashSalesRatio) || 0,
                    transferenceSalesRatio: parseFloat(data.transferenceSalesRatio) || 0,
                    creditSalesRatio: parseFloat(data.creditSalesRatio) || 0
                };
                
                return stats;
            })
        );
    }
}

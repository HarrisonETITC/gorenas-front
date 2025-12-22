import { Observable } from 'rxjs';
import { BranchSalesStats, EmployeeSalesStats, PaymentMethodStats } from '@gorenas/domain';

/**
 * Port interface for statistics service
 * Defines the contract for retrieving various sales statistics
 */
export interface StatsServicePort {
    /**
     * Get employees with the highest sales amount
     * @returns Observable with array of employee sales statistics
     */
    getEmployeesWithMostAmountSold(): Observable<Array<EmployeeSalesStats>>;

    /**
     * Get employees with the most number of sales
     * @returns Observable with array of employee sales statistics
     */
    getEmployeesWithMostSales(): Observable<Array<EmployeeSalesStats>>;

    /**
     * Get branches with the most sales
     * @returns Observable with array of branch sales statistics
     */
    getBranchesWithMostSales(): Observable<Array<BranchSalesStats>>;

    /**
     * Get percentage of sales by payment method
     * @returns Observable with payment method statistics
     */
    getPercentageOfSalesByPaymentMethod(): Observable<PaymentMethodStats>;
}

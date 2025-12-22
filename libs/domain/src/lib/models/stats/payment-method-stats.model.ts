/**
 * Estadísticas de porcentaje de ventas por método de pago
 * Basado en la consulta: porcentaje de ventas según el método de pago
 */
export class PaymentMethodStats {
    /**
     * Total number of sales
     * @example 500
     */
    totalSales: number;

    /**
     * Debit card sales percentage (0-100)
     * @example 25.5
     */
    debitSalesRatio: number;

    /**
     * Platform sales percentage (0-100)
     * @example 15.0
     */
    platformsSalesRatio: number;

    /**
     * Cash sales percentage (0-100)
     * @example 35.0
     */
    cashSalesRatio: number;

    /**
     * Bank transfer sales percentage (0-100)
     * @example 12.5
     */
    transferenceSalesRatio: number;

    /**
     * Credit card sales percentage (0-100)
     * @example 12.0
     */
    creditSalesRatio: number;
}

/**
 * Estadísticas de ventas por sucursal
 * Basado en la consulta: sucursales que más venden
 */
export class BranchSalesStats {
    /**
     * Branch ID
     * @example 1
     */
    branchId: number;

    /**
     * Branch name
     * @example 'Sucursal Centro'
     */
    branchName: string;

    /**
     * Branch address
     * @example 'Av. Principal #123-45'
     */
    branchAddress: string;

    /**
     * Total sales amount for the branch
     * @example 8500000.00
     */
    totalAmount: number;
}

/**
 * Estadísticas de ventas por empleado
 * Basado en la consulta: empleados con mayor monto/cantidad de ventas
 */
export class EmployeeSalesStats {
    /**
     * Employee ID
     * @example 1
     */
    employeeId: number;

    /**
     * Employee full name (first name + last name)
     * @example 'Juan Pérez García'
     */
    fullName: string;

    /**
     * Total number of sales
     * @example 150
     */
    salesCount: number;

    /**
     * Total amount sold (truncated to integer)
     * @example 2500000
     */
    totalAmount: number;

    /**
     * Average ticket per sale (truncated to integer)
     * @example 16666
     */
    averageTicket: number;
}

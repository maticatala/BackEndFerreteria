
export interface SalesSummary {
totalRevenue: number;   // Total de ingresos
confirmedRevenue: number;   // Pedidos entregados y pagados
pendingDeliveryRevenue: number;  // Pagos recibidos, pedidos no entregados
expectedRevenue: number;    // Pedidos con pago pendiente
orderCount: number;
averageTicket: number;
period: 'monthly' | 'annual' | 'historical';
year?: number;
month?: number;
}

export interface OrderStatusCount {
status: string;
count: string;
}

export interface TopProduct {
productId: number;
productName: string;
totalQuantity: string;
totalRevenue: string;
}

export interface PopularCategory {
categoryId: number;
categoryName: string;
orderCount: string;
}

export interface DashboardData {
salesSummary: SalesSummary;  //resumen de ventas
ordersStatus: OrderStatusCount[]; //estado de los pedidos
topProducts: TopProduct[]; //productos más vendidos
popularCategories: PopularCategory[]; //categorías más populares
}
      
      
    
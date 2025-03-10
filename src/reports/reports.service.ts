import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, Not } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrdersProducts } from '../orders/entities/orders-product.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { PaymentStatus } from 'src/orders/enums/payment-status.enum';
import { DashboardData, OrderStatusCount, PopularCategory, SalesSummary, TopProduct } from './interfaces/dashboard-data.interface';

@Injectable()
export class ReportsService {

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private ordersProductsRepository: Repository<OrdersProducts>,
  ) {}

  async getSalesSummary(
    period: 'monthly' | 'annual' | 'historical' = 'monthly', 
    year?: number, 
    month?: number
  ) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;
    
    // Si no se proporciona año, usamos el año actual
    const selectedYear = year || now.getFullYear();
    
    // Si no se proporciona mes, usamos el mes actual
    // Aseguramos que month sea un valor numérico válido
    const selectedMonth = month !== undefined ? Number(month) : now.getMonth();

    if (period === 'monthly') {
      // Para periodo mensual, usamos el mes y año seleccionados
      startDate = new Date(selectedYear, selectedMonth, 1);
      
      // Fin del mes seleccionado (primer día del siguiente mes - 1 ms)
      // Usamos Date para obtener el último día del mes
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      endDate = new Date(selectedYear, selectedMonth, lastDay, 23, 59, 59, 999);
      
      // Si el mes seleccionado es el actual, limitar a la fecha actual
      if (selectedYear === now.getFullYear() && selectedMonth === now.getMonth()) {
        endDate = now;
      }
    } else if (period === 'annual') {
      // Para periodo anual, usar el año seleccionado
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
      
      // Si el año seleccionado es el actual, limitar a la fecha actual
      if (selectedYear === now.getFullYear()) {
        endDate = now;
      }
    } else {
      // Para histórico, usar la fecha más antigua posible (apertura del negocio)
      startDate = new Date(2010, 0, 1);
    }

    // Total ingresos (contando sin pagar y pagados y entregados o en proceso de envío)
    const totalOrders: Order[] = await this.ordersRepository.find({
      where: {
        orderAt: Between(startDate, endDate),
        status: Not(OrderStatus.CANCELLED),
        payments: { status: In([PaymentStatus.PENDING, PaymentStatus.IN_PROCESS, PaymentStatus.COMPLETED, PaymentStatus.APPROVED]) } 
      },
      relations: ['products', 'payments'],
    });

    // ingresos confirmados con entrega completada y pago completado
    const deliveredOrders: Order[] = await this.ordersRepository.find({
      where: {
        orderAt: Between(startDate, endDate),
        status: OrderStatus.DELIVERED,
        payments: { status: In([PaymentStatus.COMPLETED, PaymentStatus.APPROVED]) }
      },
      relations: ['products', 'payments'] 
    });
    
    // Ingresos con pago completado y sin entregar
    const pendingDeliveryOrders:Order[] = await this.ordersRepository.find({
      where: {
        orderAt: Between(startDate, endDate),
        status: In([OrderStatus.PROCESSING, OrderStatus.SHIPPED]), 
        payments: { status: In([PaymentStatus.COMPLETED, PaymentStatus.APPROVED]) }
      },
      relations: ['products', 'payments']
    });

    const expectedOrders: Order[] = await this.ordersRepository.find({
      where: {
        orderAt: Between(startDate, endDate),
        payments: { status: In([PaymentStatus.PENDING, PaymentStatus.IN_PROCESS]) }
      },
      relations: ['products', 'payments']
    });

    // Calculo de ingresos
    const totalRevenue = this.calculateRevenue(totalOrders);
    const confirmedRevenue = this.calculateRevenue(deliveredOrders);
    const pendingDeliveryRevenue = this.calculateRevenue(pendingDeliveryOrders);
    const expectedRevenue = this.calculateRevenue(expectedOrders);

    // Promedio de ventas por pedido - pedidos completados (pedidos entregados y pagos)
    const orderCount = deliveredOrders.length;
    const averageTicket = orderCount > 0 ? confirmedRevenue / orderCount : 0;

    const salesSummary: SalesSummary = {
      totalRevenue,
      confirmedRevenue,
      pendingDeliveryRevenue,
      expectedRevenue,
      orderCount,
      averageTicket,
      period,
      year: selectedYear,
      month: period === 'monthly' ? selectedMonth : undefined,
    };
  
    return salesSummary;
  }

  private calculateRevenue(orders: Order[]): number {
    return orders.reduce((total, order) => 
      total + (order.products?.reduce((subtotal, orderProduct) => 
        subtotal + (orderProduct.product_unit_price * orderProduct.product_quantity), 0) || 0)
    , 0);
  }


  async getOrdersStatus(): Promise<OrderStatusCount[]> {
    // Obtener conteo de pedidos por estado
    const ordersByStatus: OrderStatusCount[] = await this.ordersRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();

    return ordersByStatus;
  }

  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    // Obtener productos más vendidos basado en cantidad vendida
    const topProducts: TopProduct[] = await this.ordersProductsRepository
      .createQueryBuilder('orderProduct')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(orderProduct.product_quantity)', 'totalQuantity')
      .addSelect('SUM(orderProduct.product_unit_price * orderProduct.product_quantity)', 'totalRevenue')
      .leftJoin('orderProduct.product', 'product')
      .groupBy('product.id')
      .orderBy('totalQuantity', 'DESC')
      .limit(limit)
      .getRawMany();

    return topProducts;
  }

  async getPopularCategories(limit: number = 5): Promise<PopularCategory[]> {
    // Obtener categorías más populares basado en ventas
    const popularCategories: PopularCategory[] = await this.ordersProductsRepository
      .createQueryBuilder('orderProduct')
      .select('category.id', 'categoryId')
      .addSelect('category.categoryName', 'categoryName')
      .addSelect('COUNT(DISTINCT orderProduct.id)', 'orderCount')
      .addSelect('category.description', 'description')
      .addSelect('category.imagen', 'imagen')
      .leftJoin('orderProduct.product', 'product')
      .leftJoin('product.categories', 'category')
      .groupBy('category.id')
      .orderBy('orderCount', 'DESC')
      .limit(limit)
      .getRawMany();

    return popularCategories;
  }

  async getDashboardData(
    period: 'monthly' | 'annual' | 'historical' = 'historical',
    year?: number,
    month?: number
  ) {

    // Convertir parámetros a números para asegurar consistencia
    const numYear = year ? Number(year) : undefined;
    const numMonth = month !== undefined ? Number(month) : undefined;
  

    const dashboardData: DashboardData = {
      salesSummary: await this.getSalesSummary(period, numYear, numMonth),
      ordersStatus: await this.getOrdersStatus(),
      topProducts: await this.getTopProducts(5),
      popularCategories: await this.getPopularCategories(5),
    }

    return dashboardData;
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrdersProducts } from '../orders/entities/orders-product.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';

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


    // Obtener órdenes por período
    const orders = await this.ordersRepository.find({
      where: {
        orderAt: Between(startDate, endDate),
        // Suponemos que los pedidos completados o entregados son los que cuentan como ventas realizadas
        status: OrderStatus.DELIVERED, 
      },
      relations: ['products'],
    });


    // Calcular métricas
    let totalRevenue = 0;
    
    // Calculamos los ingresos totales sumando (precio * cantidad) de cada línea de pedido
    for (const order of orders) {
      for (const orderProduct of order.products) {
        totalRevenue += parseFloat(orderProduct.product_unit_price.toString()) * orderProduct.product_quantity;
      }
    }

    const orderCount = orders.length;
    const averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0;

    const result = {
      totalRevenue,
      orderCount,
      averageTicket,
      period,
      year: selectedYear,
      month: period === 'monthly' ? selectedMonth : undefined,
    };
    
    return result;
  }

  async getOrdersStatus() {
    // Obtener conteo de órdenes por estado
    const ordersByStatus = await this.ordersRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();

    // Obtener órdenes pendientes de procesamiento
    const pendingOrders = await this.ordersRepository.count({
      where: { status: OrderStatus.PROCESSING },
    });

    return {
      ordersByStatus,
      pendingOrders,
    };
  }

  async getTopProducts(limit: number = 10) {
    // Obtener productos más vendidos basado en cantidad vendida
    const topProducts = await this.ordersProductsRepository
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

  async getPopularCategories(limit: number = 5) {
    // Obtener categorías más populares basado en ventas
    const popularCategories = await this.ordersProductsRepository
      .createQueryBuilder('orderProduct')
      .select('category.id', 'categoryId')
      .addSelect('category.categoryName', 'categoryName')
      .addSelect('COUNT(DISTINCT orderProduct.id)', 'orderCount')
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
    
    // Obtener todos los datos para el dashboard en una sola llamada
    const [salesSummary, ordersStatus, topProducts, popularCategories] = await Promise.all([
      this.getSalesSummary(period, numYear, numMonth),
      this.getOrdersStatus(),
      this.getTopProducts(5),
      this.getPopularCategories(5),
    ]);

    return {
      salesSummary,
      ordersStatus,
      topProducts,
      popularCategories,
    };
  }
}
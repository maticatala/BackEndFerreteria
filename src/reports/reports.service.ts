// src/reports/reports.service.ts
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
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getSalesSummary(period: 'monthly' | 'annual' = 'monthly') {
    const now = new Date();
    let startDate: Date;
    
    if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    // Obtener órdenes por período
    const orders = await this.ordersRepository.find({
      where: {
        orderAt: Between(startDate, now),
        // Suponemos que los pedidos completados o entregados son los que cuentan como ventas realizadas
        status: OrderStatus.DELIVERED, 
      },
      relations: ['products'], // Para calcular el total
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

    return {
      totalRevenue,
      orderCount,
      averageTicket,
      period,
    };
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
    // Esta consulta es más compleja debido a la relación muchos a muchos entre productos y categorías
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

  async getDashboardData() {
    // Obtener todos los datos para el dashboard en una sola llamada. Por defecto mostramos esto.
    // SalesSummary se inicializa en mensual, pero en el front esta implementado para hacer el cambio anual.
    // Los endpoints de topProducts y popularCategories no estan implementados en el front(en typesccript) siempre se muestran de a 5.
    const [salesSummary, ordersStatus, topProducts, popularCategories] = await Promise.all([
      this.getSalesSummary('monthly'),
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
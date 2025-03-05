import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  // private readonly logger = new Logger(ReportsController.name);
  
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-summary')
  async getSalesSummary(
    @Query('period') period: 'monthly' | 'annual' | 'historical' = 'monthly',
    @Query('year') year?: number,
    @Query('month') month?: number
  ) {
    return this.reportsService.getSalesSummary(period, year, month);
  }

  @Get('orders-status')
  async getOrdersStatus() {
    return this.reportsService.getOrdersStatus();
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit: number = 10) {
    return this.reportsService.getTopProducts(limit);
  }

  @Get('popular-categories')
  async getPopularCategories(@Query('limit') limit: number = 5) {
    return this.reportsService.getPopularCategories(limit);
  }

  @Get('dashboard')
  async getDashboardData(
    @Query('period') period: 'monthly' | 'annual' | 'historical' = 'historical',
    @Query('year') year?: number,
    @Query('month') month?: number
  ) {
       // Endpoint para obtener todos los datos para el dashboard en una sola llamada
    return this.reportsService.getDashboardData(period, year, month);
  }
}
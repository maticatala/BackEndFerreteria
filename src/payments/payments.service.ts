import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { CreateMpOrderDto } from './dto/create-mp-order.dto';
import { User } from 'src/auth/entities/user.entity';
import { OrdersService } from 'src/orders/orders.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { PaymentStatus } from 'src/orders/enums/payment-status.enum';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PaymentsService {
  private mercadopago: Preference;
  private payment: Payment;

  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService,
  ) {
    // Inicializar Mercado Pago con el access token
    const client = new MercadoPagoConfig({
      accessToken:
        'APP_USR-8919265566267634-022418-4e66537ef95b3a836a093f0c232184d8-2289405776',
    });

    this.mercadopago = new Preference(client);
    this.payment = new Payment(client);
  }

  async createPreferece(
    createMpOrderDto: CreateMpOrderDto,
    currentUser: User,
  ): Promise<any> {
    const { items, shippingAddress } = createMpOrderDto;

    const body = {
      items,
      back_urls: {
        failure: `http://localhost:3000/payments/failure`,
        success: 'http://localhost:4200/#/payment-confirmation',
        pending: 'http://localhost:3000/payments/pending',
      },
      notification_url:
        'https://9577-190-2-98-31.ngrok-free.app/payments/webhook',
      auto_return: 'approved',
      external_reference: JSON.stringify({
        currentUser: currentUser.id,
        shippingAddress,
      }),
    };

    try {
      const result = await this.mercadopago.create({ body });

      return {init_point: result.init_point};
    } catch (error) {
      console.error('Error al crear la orden:', error);
      throw new InternalServerErrorException('No se pudo crear la orden');
    }
  }

  async getPaymentById(paymentId: string) {
    try {
      const payment = await this.payment.get({ id: paymentId });
      return payment;
    } catch (error) {
      console.error('Error al obtener el pago:', error);
      throw new Error('No se pudo obtener la información del pago');
    }
  }

  async createOrder(req) {
    const notificationData = req.body.data;

    if (!notificationData) return;

    const payment = await this.getPaymentById(notificationData.id);

    let newStatus;
    
    for (const status of Object.values(PaymentStatus)) {
      if (payment.status === status) {
        newStatus = status;
        break;
      }
    }

    if (!newStatus) return;

    const updatedOrder = await this.ordersService.updatePaymentStatusMp(payment.order.id.toString(), {status: newStatus})

    if (updatedOrder) return HttpStatus.OK;

    const er = JSON.parse(payment.external_reference);

    let orderedProducts = [];

    for (const item of payment.additional_info.items) {
      const op = {
        id: Number(item.id),
        product_quantity: item.quantity,
      };
      orderedProducts.push(op);
    }

    const createOrderDto: CreateOrderDto = {
      shippingAddress: er.shippingAddress,
      orderedProducts,
      payments: [
        {
          paymentType: 'Mercado Pago',
          amount: payment.transaction_details.total_paid_amount,
          currency: payment.currency_id,
          status: newStatus,
          installments: payment.installments,
          paymentMethodType: payment.payment_type_id,
          paymentFinancialSystem: payment.payment_method_id,
          orderMpId: payment.order.id
        },
      ],
    };

    const currentUser = await this.authService.findUserById(er.currentUser);

    await this.ordersService.create(createOrderDto, currentUser);

    return HttpStatus.OK;
  }

  async deleteOrder(orderId: number) {
    return await this.ordersService.deleteOrder(orderId);
  }
}

import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { CreateMpOrderDto } from './dto/create-mp-order.dto';
import { User } from 'src/auth/entities/user.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/entities/order.entity';
import { ItemMP } from './interface/item-mp.interface';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { PaymentStatus } from 'src/orders/enums/payment-status.enum';
// import { CreateOrderDto2 } from 'src/orders/dto/create-order2.dto';decorator';

@Injectable()
export class PaymentsService {
  private mercadopago: Preference;
  private payment: Payment;

  constructor(
    private readonly ordersService: OrdersService  ) {
    // Inicializar Mercado Pago con el access token
    const client = new MercadoPagoConfig({
      accessToken: 'APP_USR-8919265566267634-022418-4e66537ef95b3a836a093f0c232184d8-2289405776',
    });

    this.mercadopago = new Preference(client);
    this.payment = new Payment(client);
    
  }

  async createOrder(createOrderDto: CreateOrderDto, currentUser: User): Promise<any> {

    const order = await this.ordersService.create(createOrderDto, currentUser);

    const items: ItemMP[] = order.products.map((orderProduct) => ({
      id: String(orderProduct.product.id),          // Convertir el id a string si es numérico
      title: orderProduct.product.name,               // O usa 'title' si es el nombre del producto
      unit_price: Number(orderProduct.product_unit_price),
      quantity: orderProduct.product_quantity,
      currency_id: 'ARS'                              // O extraer este dato desde otra fuente/configuración
    }));

    const body = {
      items,
      back_urls: {
          failure: `http://localhost:3000/payments/failure/${order.id}`,
          success: 'http://localhost:4200/#/payment-confirmation',
          pending: 'http://localhost:3000/payments/pending',
      },
      notification_url: 'https://2686-186-124-42-34.ngrok-free.app/payments/webhook',
      auto_return: 'approved',
      external_reference: order.payments[0].id.toString(),
    }

    try {
      // console.log("order",order);
      // console.log("items",items);
      // console.log("body",body);
      const result = await this.mercadopago.create({body})
      // console.log("result------------------------------------------------------------------------",result);

      const mpPreferenceId = result.id;
      order.payments[0].transactionId = mpPreferenceId;

      await this.ordersService.updatePayment(
        order.payments[0].id,
        { transactionId: mpPreferenceId, status: PaymentStatus.PENDING }, // asegúrate de que 'PENDING' esté en tu enum
        currentUser
      );

      return { init_point: result.init_point, orderId: order.id };
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

  async updatePayment(req, currentUser : User) {
  // Supongamos que la notificación trae un objeto con data y external_reference
    let newStatus;
    const notificationData = req.body.data;
    if(!notificationData ) return;
    const payment = await this.getPaymentById(notificationData.id);

    for (const status of Object.values(PaymentStatus)) {
      if (payment.status === status) {
        newStatus = status
        break
      }; 
    }

    if (!newStatus ) return;
      // Actualiza el Payment en la orden según la notificación
    await this.ordersService.updatePayment(
      Number(payment.external_reference), 
      {
        transactionId: notificationData.id,
        status: newStatus,
      },
      currentUser
      ); // Si no requieres currentUser en esta actualización, o podrías omitirlo
    // }
    return HttpStatus.OK;
  }

  async deleteOrder(orderId: number) {
    return await this.ordersService.deleteOrder(orderId);
  }

}
    
import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { CreateMpOrderDto } from './dto/create-mp-order.dto';
import { User } from 'src/auth/entities/user.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/entities/order.entity';
import { ItemMP } from './interface/item-mp.interface';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { PaymentStatus } from 'src/orders/enums/payment-status.enum';
import { ProductsService } from 'src/products/products.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PaymentsService {
  private mercadopago: Preference;
  private payment: Payment;

  constructor(
    private readonly ordersService: OrdersService,  
    private readonly productsService: ProductsService,
    private readonly authService: AuthService,
  ) {
    // Inicializar Mercado Pago con el access token
    const client = new MercadoPagoConfig({
      accessToken: 'APP_USR-8919265566267634-022418-4e66537ef95b3a836a093f0c232184d8-2289405776',
    });

    this.mercadopago = new Preference(client);
    this.payment = new Payment(client);
    
  }

  async createPreferece(createOrderDto: CreateOrderDto, currentUser: User): Promise<any> {

    const items: ItemMP[] = [];

    for (const op of createOrderDto.orderedProducts) {
      const product = await this.productsService.findOne(op.id); // Esperar el resultado de la búsqueda del producto
      
      // Llenar los datos de los productos en el array 'items'
      items.push({
        id: String(op.id),  // Convertir el id a string si es numérico
        title: product.name, // Usar el nombre del producto
        unit_price: Number(product.price), // Precio unitario
        quantity: op.product_quantity, // Cantidad
        currency_id: 'ARS' // Moneda, puedes extraerla de otro lado si es necesario
      });
    }

    const body = {
      items,
      back_urls: {
          failure: `http://localhost:3000/payments/failure`,
          success: 'http://localhost:4200/#/payment-confirmation',
          pending: 'http://localhost:3000/payments/pending',
      },
      notification_url: 'https://30fa-170-84-207-30.ngrok-free.app/payments/webhook',
      auto_return: 'approved',
      external_reference: JSON.stringify({
        currentUser: currentUser.id,
        shippingAddress: createOrderDto.shippingAddress
      })
    } 

    try {
      const result = await this.mercadopago.create({body})
      return { init_point: result.init_point };
    } catch (error) {
      console.error('Error al crear la orden:', error);
      throw new InternalServerErrorException('No se pudo crear la orden');
    }
    
  }
  // async createOrder(createOrderDto: CreateOrderDto, currentUser: User): Promise<any> {

  //   const order = await this.ordersService.create(createOrderDto, currentUser);

  //   const items: ItemMP[] = order.products.map((orderProduct) => ({
  //     id: String(orderProduct.product.id),          // Convertir el id a string si es numérico
  //     title: orderProduct.product.name,               // O usa 'title' si es el nombre del producto
  //     unit_price: Number(orderProduct.product_unit_price),
  //     quantity: orderProduct.product_quantity,
  //     currency_id: 'ARS'                              // O extraer este dato desde otra fuente/configuración
  //   }));

  //   const body = {
  //     items,
  //     back_urls: {
  //         failure: `http://localhost:3000/payments/failure`,
  //         success: 'http://localhost:4200/#/payment-confirmation',
  //         pending: 'http://localhost:3000/payments/pending',
  //     },
  //     notification_url: 'https://1838-170-84-207-30.ngrok-free.app/payments/webhook',
  //     auto_return: 'approved',
  //     external_reference: order.payments[0].id.toString(),
  //   } 

  //   try {
  //     // console.log("order",order);
  //     // console.log("items",items);
  //     // console.log("body",body);
  //     const result = await this.mercadopago.create({body})
  //     // console.log("result------------------------------------------------------------------------",result);

  //     const mpPreferenceId = result.id;
  //     order.payments[0].transactionId = mpPreferenceId;

  //     await this.ordersService.updatePayment(
  //       order.payments[0].id,
  //       { transactionId: mpPreferenceId, status: PaymentStatus.PENDING }, // asegúrate de que 'PENDING' esté en tu enum
  //       currentUser
  //     );

  //     return { init_point: result.init_point, orderId: order.id };
  //   } catch (error) {
  //     console.error('Error al crear la orden:', error);
  //     throw new InternalServerErrorException('No se pudo crear la orden');
  //   }
    
  // }

  async getPaymentById(paymentId: string) {

      try {
        const payment = await this.payment.get({ id: paymentId });
        return payment;
      } catch (error) {
        console.error('Error al obtener el pago:', error);
        throw new Error('No se pudo obtener la información del pago');
      }
  }

  async updatePayment(req) {
  // Supongamos que la notificación trae un objeto con data y external_reference

  
  const notificationData = req.body.data;
  
  if(!notificationData ) return;
  
  const payment = await this.getPaymentById(notificationData.id);
  
  let newStatus;
  
  for (const status of Object.values(PaymentStatus)) {
    if (payment.status === status) {
      newStatus = status
      break
    }; 
  }
    if (!newStatus ) return;

    const er =  JSON.parse(payment.external_reference);

    let orderedProducts = [];

    for (const item of payment.additional_info.items) {
      const op = {
        id: item.id,
        product_quantity: item.quantity
      }
      orderedProducts.push(op);
    }


    const createOrderDto: CreateOrderDto = {
      shippingAddress: er.shippingAddress,
      orderedProducts,
      payments: [
        {
          paymentType: "Mercado Pago",
          amount: payment.transaction_details.total_paid_amount,
          currency: payment.currency_id,
          status: newStatus,
        }
      ]
    }

    const currentUser = await this.authService.findUserById(er.currentUser);

    await this.ordersService.create(createOrderDto, currentUser);
    
    return HttpStatus.OK;
  }

  async deleteOrder(orderId: number) {
    return await this.ordersService.deleteOrder(orderId);
  }

}
    
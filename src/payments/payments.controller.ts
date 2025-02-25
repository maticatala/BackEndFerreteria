import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateMpOrderDto } from './dto/create-mp-order.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
// import { CreateOrderDto2 } from 'src/orders/dto/create-order2.dto';

@Controller('payments')
export class PaymentsController {
    
    constructor(
        private readonly paymentsService: PaymentsService,
    ) {}

    
    // @Post('/create-order') //31.15
    // async createOrder(@Req() req, @Res() res) {
    //     try {
    //         const order = await this.paymentsService.createOrder();
    //         console.log(order)
    //         return res.json(order);
    //       } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //       }
    // }

    @UseGuards(AuthenticationGuard)
    @Post('/create-order') //31.15
    async createOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: User): Promise<string> {
      return await this.paymentsService.createOrder(createOrderDto, currentUser);
    }

    @Get('success')
    success(@Res() res) {
      res.send('Pago aprobado. ¡Gracias por tu compra!');
      
    }
  
    @Get('failure')
    failure(@Res() res) {
      res.send('Hubo un problema con tu pago. Intenta nuevamente.');
    }
  
    @Post('webhook')
    async pending(@Req() req, @CurrentUser() currentUser: User) {

      await this.paymentsService.updatePayment(req, currentUser);

      // if (req.body?.data?.id) {
      //   console.log(req.body);
      // }
      //----------------------------------------------------
      // try {
      //   console.log('Datos recibidos en el webhook:', req.body);
        
      //   // this.paymentsService.createOrder(req.body);

      //   const paymentId = req.body?.data?.id; // Extrae el ID del pago
      //   if (!paymentId) {
      //     return res.status(400).json({ error: 'Payment ID is required' });
      //   }

      //   await this.paymentsService.createOrder2(req.body);
    
      //   const payment = await this.paymentsService.getPaymentById(paymentId);
      //   console.log('Información del pago:', payment);
    
      //   res.status(200).json({ message: 'Webhook recibido', payment });
      // } catch (error) {
      //   console.error('Error en el webhook:', error);
      //   res.status(500).json({ error: 'Internal Server Error' });
      // }
    
  }
}

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateMpOrderDto } from './dto/create-mp-order.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';

@Controller('payments')
export class PaymentsController {
    
    constructor(
        private readonly paymentsService: PaymentsService,
    ) {}

    @UseGuards(AuthenticationGuard)
    @Post('/create-preference') 
    async createPreference(@Body() createMpOrderDto: CreateMpOrderDto, @CurrentUser() currentUser: User): Promise<string> {
      return await this.paymentsService.createPreferece(createMpOrderDto, currentUser);
    }

    @Post('/webhook')
    async webhook(@Req() req) {
      this.paymentsService.createOrder(req);
    }
  
    @Get('failure')
    async failure(@Res() res) {
      res.redirect('http://localhost:4200/#/checkout');
    }

    
    @Get('pending')
    pending(@Req() req, @Res() res) {
      res.redirect('http://localhost:4200/#/payment-pending');
  }


}

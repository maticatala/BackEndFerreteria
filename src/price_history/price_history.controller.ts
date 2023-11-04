import { Body, Controller, Post } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { PriceHistoryService } from './price_history.service';

@Controller('price-history')
export class PriceHistoryController {

    constructor(private priceService: PriceHistoryService){}

    @Post()
    createPrice(@Body() newPrice: CreatePriceDto){
      console.log(newPrice)
      return this.priceService.createPrice(newPrice)
    }

}

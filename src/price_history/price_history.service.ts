import { BadRequestException, Injectable } from '@nestjs/common';
import { PriceHistory } from './price_history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { CreatePriceDto } from './dto/create-price.dto';

@Injectable()
export class PriceHistoryService {
    constructor(@InjectRepository(PriceHistory) private PriceHistoryRepository: Repository<PriceHistory>){}
    
    async createPrice(price: CreatePriceDto){
            try {
                //Validar que el producto recibido exista

                const newPrice = this.PriceHistoryRepository.create(price);
                await this.PriceHistoryRepository.save(newPrice);
                return newPrice; 
                
    }catch (error) {
        if (!error.errno) throw new BadRequestException(error.message);
    }

    }//async
} 


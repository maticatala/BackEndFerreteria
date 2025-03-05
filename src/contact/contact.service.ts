import { Inject, Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import { EmailResponseDto } from './dto/email-response.dto';
import { IMailService } from 'src/mails/interfaces/mails.interface';

@Injectable()
export class ContactService {

  constructor(
   
    @Inject('IMailService')
    private mailsService: IMailService,
    
  ) {}

  async sendEmail(contactDto: ContactDto): Promise<EmailResponseDto> {
    return await this.mailsService.sendEmail(contactDto);
  }

}
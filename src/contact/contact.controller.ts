import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
import { EmailResponseDto } from './dto/email-response.dto';

@Controller('/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendContactEmail(@Body() contactDto: ContactDto): Promise<EmailResponseDto> {
    return this.contactService.sendEmail(contactDto);
  }
}
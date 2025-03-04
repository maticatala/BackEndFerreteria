import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactDto } from './dto/contact.dto';
import { EmailResponseDto } from './dto/email-response.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(contactDto: ContactDto): Promise<EmailResponseDto> {
    try {
      await this.mailerService.sendMail({
        from: `"Formulario de Contacto Beyond Limits" <${this.sanitize(contactDto.email)}>`,
        to: 'tepieroni@gmail.com', 
        replyTo: this.sanitize(contactDto.email),
        subject: `Beyond Limits: ${this.sanitize(contactDto.subject)}`,
        html: this.buildAdminEmail(contactDto),
      
      });
      
      // Enviar un correo de confirmación al cliente
      await this.mailerService.sendMail({
        to: contactDto.email,
        subject: 'Hemos recibido tu mensaje',
        html: this.buildCustomerEmail(contactDto),
      });

      const emailResponseDto: EmailResponseDto = {
        success: true,
        message: 'Email enviado correctamente',
        };

      return emailResponseDto;

    } catch (error) {
      console.error('Error al enviar email', error);
      const emailResponseDto: EmailResponseDto = {
        success: false,
        message: 'No se pudo enviar el email',
        };

      return emailResponseDto;
    }
  }

  private buildAdminEmail(contactDto: ContactDto): string {
    return `
      <h3>Nuevo mensaje recibido</h3>
      <p><strong>Nombre:</strong> ${this.sanitize(contactDto.name)}</p>
      <p><strong>Email:</strong> ${this.sanitize(contactDto.email)}</p>
      <p><strong>Asunto:</strong> ${this.sanitize(contactDto.subject)}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-line;">${this.sanitize(contactDto.message)}</p>
    `;
  }

  private buildCustomerEmail(contactDto: ContactDto): string {
    return `
      <h3>Gracias por contactarnos</h3>
      <p>Hemos recibido tu mensaje y te responderemos a la brevedad posible.</p>
      <h4>Detalles de tu consulta:</h4>
      <p><strong>Asunto:</strong> ${this.sanitize(contactDto.subject)}</p>
      <p><strong>Mensaje:</strong></p>
      <blockquote style="white-space: pre-line;">${this.sanitize(contactDto.message)}</blockquote>
      <h4>Beyond Limits - Impresiones 3D</h4>
    `;
  }

  // Sanitizar valores para prevenir inyección de código mailicioso. 
  // Convierte los valores a texto plano en vez de codigo html que pueda ejecutarse.
  private sanitize(value: string): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
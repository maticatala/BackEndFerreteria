import { ConflictException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from './interfaces/mails.interface';
import { ContactDto } from 'src/contact/dto/contact.dto';
import { EmailResponseDto } from 'src/contact/dto/email-response.dto';

@Injectable()
export class NodemailerService implements IMailService {

  constructor(
    private mailerService: MailerService,
    @Inject('FRONTEND_BASE_URL') private frontendUrl: string,
  ) { }
  
  async restorePassword(name:string, email: string, token: string): Promise<void> {
    const resetLink = `${this.frontendUrl}/#/auth/reset-password/${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Restablece tu contraseña',
        template: './resetPassword',
        context: { name, resetLink }
      });
    } catch (error) {
      if(error.code = "EAUTH") {
        throw new ConflictException({
          code: 'INVALID_LOGIN',
          message: 'Invalid login: Username and Password not accepted.',
        });
      }
      throw new InternalServerErrorException({
        code: 'EMAIL_SENT_FAILED',
        message: 'El email no pudo ser enviado. Puedes reintentar enviarlo.',
      });
    }
  }

    async sendEmail(contactDto: ContactDto): Promise<EmailResponseDto> {
      try {
        await this.mailerService.sendMail({
          from: `"Formulario de Contacto Beyond Limits" <${this.sanitize(contactDto.email)}>`,
          to: 'b.l.3d.impresiones@gmail.com',
          replyTo: this.sanitize(contactDto.email),
          subject: `Beyond Limits: ${this.sanitize(contactDto.subject)}`,
          template: './adminEmail',
          context: { name: contactDto.name, email: contactDto.email, subject: contactDto.subject, message: contactDto.message },
        });
        
        // Enviar un correo de confirmación al cliente
        await this.mailerService.sendMail({
          to: contactDto.email,
          subject: 'Hemos recibido tu mensaje',
          template: './customerEmail',
          context: { subject: contactDto.subject, message: contactDto.message },
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

    private sanitize(value: string): string {
      return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

}

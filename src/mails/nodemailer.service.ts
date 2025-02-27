import { ConflictException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from './interfaces/mails.interface';

@Injectable()
export class NodemailerService implements IMailService {

  constructor(
    private mailerService: MailerService,
    @Inject('FRONTEND_BASE_URL') private frontendUrl: string,
  ) { }

  async restorePassword(name:string, email: string, token: string): Promise<void> {
    const resetLink = `${this.frontendUrl}/auth/reset-password/${token}`;

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

}

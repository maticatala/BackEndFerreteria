import { ContactDto } from "src/contact/dto/contact.dto";
import { EmailResponseDto } from "src/contact/dto/email-response.dto";

export interface IMailService {
    sendEmail(contactDto: ContactDto): Promise<EmailResponseDto>;
    restorePassword(firstName: string, email: string, token: string): Promise<void>;
}
  
export interface IMailService {
    // sendUserConfirmation(firstName: string, email: string, token: string): Promise<void>;

    restorePassword(firstName: string, email: string, token: string): Promise<void>;
}
  
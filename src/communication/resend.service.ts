import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IResendService } from './interfaces/resend.service.interface';
import { generateConfirmationEmail, generateOwnerNotificationEmail } from 'src/templates/emailTemplate';

@Injectable()
export class ResendService implements IResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not found in environment variables');
    }
    this.resend = new Resend(apiKey);
  }

async sendToOwner({ name, email, message }: { name: string; email: string; message: string }): Promise<any> {
  try {
    const result = await this.resend.emails.send({
      from: 'Calanco Contact <noreply@calanco.dev>',
      to: 'francesca.bozzoli@calanco.dev',
      subject: '📬 Nuovo messaggio dal sito',
      
      // Versione plain text (fallback)
      text: `Hai ricevuto un messaggio da ${name} <${email}>:\n\n${message}`,
      
      // // Versione HTML con il template
      // html: generateOwnerNotificationEmail({
      //   senderName: name,
      //   senderEmail: email,
      //   message: message
      // }),
    });
    
    this.logger.log(`Email sent to owner for contact from ${email}`);
    return result;
  } catch (error) {
    this.logger.error(`Failed to send email to owner: ${error.message}`);
    throw error;
  }
}

async sendToUser({ name, email }: { name: string; email: string }): Promise<any> {
  try {
    const result = await this.resend.emails.send({
      from: 'Francesca Bozzoli - Calanco <noreply@calanco.dev>',
      to: email,
      subject: 'Grazie per il tuo contatto',
      
      // Versione plain text (fallback)
      text: `Ciao ${name},\n\ngrazie per il tuo messaggio! Ti risponderò appena possibile.\n\n— Francesca di Calanco.dev`,
      
      // // Versione HTML con il template
      // html: generateConfirmationEmail(name),
    });
    
    this.logger.log(`Confirmation email sent to ${email}`);
    return result;
  } catch (error) {
    this.logger.error(`Failed to send confirmation email to ${email}: ${error.message}`);
    throw error;
  }
}
}

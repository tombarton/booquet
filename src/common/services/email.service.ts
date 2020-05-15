import { Injectable, Logger } from '@nestjs/common';
import { ServerClient } from 'postmark';
import { ConfigService } from '@nestjs/config';

interface ResetEmail {
  name: string;
  email: string;
  url: string;
}

@Injectable()
export class EmailService {
  client: ServerClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new ServerClient(configService.get('POSTMARK_KEY'));
  }

  async sendPasswordResetEmail({
    name,
    email,
    url,
  }: ResetEmail): Promise<boolean> {
    try {
      const emailResult = await this.client.sendEmailWithTemplate({
        TemplateId: 16084088,
        From: this.configService.get('EMAIL_FROM_ADDRESS'),
        To: email,
        // @TODO: Sort out email templates and variables.
        TemplateModel: {
          name,
          /* eslint-disable @typescript-eslint/camelcase */
          product_name: 'Booquet',
          action_url: url,
          operating_system: 'operating_system_Value',
          browser_name: 'browser_name_Value',
          support_url: 'support_url_Value',
          product_url: 'product_url_Value',
          company_name: 'company_name_Value',
          company_address: 'company_address_Value',
          /* eslint-enable @typescript-eslint/camelcase */
        },
      });

      return emailResult.ErrorCode === 0;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}

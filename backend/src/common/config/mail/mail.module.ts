// src/mail/mail.module.ts
import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mail = config.get('mail');

        return {
          transport: {
            host: mail.host,
            port: mail.port,
            secure: false,
            auth: {
              user: mail.user,
              pass: mail.pass,
            },
          },
          defaults: {
            from: mail.from,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

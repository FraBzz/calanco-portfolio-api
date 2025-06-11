// src/contact/contact.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ResendService } from './resend.service';

@Module({
    imports: [ConfigModule],
    controllers: [ContactController],
    providers: [
        {
            provide: 'IContactService',
            useClass: ContactService,
        },
        {
            provide: 'IResendService',
            useClass: ResendService,
        }
    ],
    exports: ['IContactService', 'IResendService'],
})
export class ContactModule { }

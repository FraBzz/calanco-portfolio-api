import { Inject, Injectable } from '@nestjs/common';
import { IResendService } from './interfaces/resend.service.interface';
import { IContactService } from './interfaces/contact.service.interface';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService implements IContactService {
    constructor(
        @Inject('IResendService')
        private resendService: IResendService
    ) { }

    async handleContact(dto: ContactDto): Promise<void> {
        await this.resendService.sendToOwner(dto);
        await this.resendService.sendToUser(dto);
    }
}

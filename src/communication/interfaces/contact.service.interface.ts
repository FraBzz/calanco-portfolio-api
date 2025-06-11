import { ContactDto } from "../dto/contact.dto";

export interface IContactService {
    handleContact(dto: ContactDto): Promise<void>;
}
export interface IResendService {
    sendToOwner({ name, email, message }: { name: string; email: string; message: string }): Promise<any>;
    sendToUser({ name, email }: { name: string; email: string }): Promise<any>;
}
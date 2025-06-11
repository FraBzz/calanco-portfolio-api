import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { IResendService } from './interfaces/resend.service.interface';
import { ContactDto } from './dto/contact.dto';

describe('ContactService', () => {
  let service: ContactService;
  let resendService: jest.Mocked<IResendService>;

  const mockResendService = {
    sendToOwner: jest.fn(),
    sendToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: 'IResendService',
          useValue: mockResendService,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    resendService = module.get('IResendService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleContact', () => {
    it('should send emails to both owner and user', async () => {
      // Arrange
      const contactDto: ContactDto = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        message: 'Test message'
      };

      mockResendService.sendToOwner.mockResolvedValue({ id: 'owner-email-id' });
      mockResendService.sendToUser.mockResolvedValue({ id: 'user-email-id' });

      // Act
      await service.handleContact(contactDto);

      // Assert
      expect(mockResendService.sendToOwner).toHaveBeenCalledWith(contactDto);
      expect(mockResendService.sendToUser).toHaveBeenCalledWith(contactDto);
      expect(mockResendService.sendToOwner).toHaveBeenCalledTimes(1);
      expect(mockResendService.sendToUser).toHaveBeenCalledTimes(1);
    });

    it('should handle resend service errors', async () => {
      // Arrange
      const contactDto: ContactDto = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        message: 'Test message'
      };

      const error = new Error('Email sending failed');
      mockResendService.sendToOwner.mockRejectedValue(error);

      // Act & Assert
      await expect(service.handleContact(contactDto)).rejects.toThrow('Email sending failed');
      expect(mockResendService.sendToOwner).toHaveBeenCalledWith(contactDto);
      expect(mockResendService.sendToUser).not.toHaveBeenCalled();
    });
  });
});

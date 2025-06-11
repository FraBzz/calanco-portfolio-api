import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ResendService } from './resend.service';

// Mock Resend class
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}));

describe('ResendService', () => {
  let service: ResendService;
  let configService: ConfigService;
  let mockResendInstance: any;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    // Reset the mock before each test
    jest.clearAllMocks();
    
    const { Resend } = require('resend');
    mockResendInstance = {
      emails: {
        send: jest.fn(),
      },
    };
    (Resend as jest.Mock).mockImplementation(() => mockResendInstance);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ResendService>(ResendService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get API key from config service', () => {
    expect(configService.get).toHaveBeenCalledWith('RESEND_API_KEY');
  });

  describe('sendToOwner', () => {
    it('should send email to owner successfully', async () => {
      // Arrange
      const contactData = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        message: 'Test message'
      };

      const mockEmailResponse = { id: 'email-id-123' };
      mockResendInstance.emails.send.mockResolvedValue(mockEmailResponse);

      // Act
      const result = await service.sendToOwner(contactData);

      // Assert
      expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
        from: 'Calanco Contact <noreply@calanco.dev>',
        to: 'francesca.bozzoli@calanco.dev',
        subject: '📬 Nuovo messaggio dal sito',
        text: `Hai ricevuto un messaggio da ${contactData.name} <${contactData.email}>:\n\n${contactData.message}`,
      });
      expect(result).toEqual(mockEmailResponse);
    });

    it('should handle email sending errors', async () => {
      // Arrange
      const contactData = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        message: 'Test message'
      };

      const error = new Error('Email sending failed');
      mockResendInstance.emails.send.mockRejectedValue(error);

      // Act & Assert
      await expect(service.sendToOwner(contactData)).rejects.toThrow('Email sending failed');
    });
  });

  describe('sendToUser', () => {
    it('should send confirmation email to user successfully', async () => {
      // Arrange
      const userData = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com'
      };

      const mockEmailResponse = { id: 'email-id-456' };
      mockResendInstance.emails.send.mockResolvedValue(mockEmailResponse);

      // Act
      const result = await service.sendToUser(userData);

      // Assert
      expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
        from: 'Francesca Bozzoli - Calanco <noreply@calanco.dev>',
        to: userData.email,
        subject: 'Grazie per averci contattato!',
        text: `Ciao ${userData.name},\n\ngrazie per il tuo messaggio! Ti risponderemo appena possibile.\n\n— Francesca di Calanco.dev`,
      });
      expect(result).toEqual(mockEmailResponse);
    });

    it('should handle confirmation email sending errors', async () => {
      // Arrange
      const userData = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com'
      };

      const error = new Error('Confirmation email sending failed');
      mockResendInstance.emails.send.mockRejectedValue(error);

      // Act & Assert
      await expect(service.sendToUser(userData)).rejects.toThrow('Confirmation email sending failed');
    });
  });
});

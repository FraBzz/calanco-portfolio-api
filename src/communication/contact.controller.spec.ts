import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { IContactService } from './interfaces/contact.service.interface';
import { ContactDto } from './dto/contact.dto';

describe('ContactController', () => {
  let controller: ContactController;
  let contactService: jest.Mocked<IContactService>;

  const mockContactService = {
    handleContact: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: 'IContactService',
          useValue: mockContactService,
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    contactService = module.get('IContactService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submitContact', () => {    it('should submit contact form successfully', async () => {
      // Arrange
      const contactDto: ContactDto = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        message: 'Test message'
      };

      mockContactService.handleContact.mockResolvedValue(undefined);

      // Act
      const result = await controller.submitContact(contactDto);

      // Assert
      expect(mockContactService.handleContact).toHaveBeenCalledWith(contactDto);
      expect(result).toEqual({
        type: 'success',
        status: 201,
        message: 'Contact form submitted successfully',
        data: { sent: true },
        timestamp: expect.any(Date)
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      const contactDto: ContactDto = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        message: 'Test message'
      };

      const error = new Error('Email service error');
      mockContactService.handleContact.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.submitContact(contactDto)).rejects.toThrow(HttpException);
      expect(mockContactService.handleContact).toHaveBeenCalledWith(contactDto);
    });

    it('should handle service errors with custom message', async () => {
      // Arrange
      const contactDto: ContactDto = {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        message: 'Test message'
      };

      const error = new Error('Custom error message');
      mockContactService.handleContact.mockRejectedValue(error);

      // Act & Assert
      try {
        await controller.submitContact(contactDto);
      } catch (thrown) {
        expect(thrown).toBeInstanceOf(HttpException);
        expect(thrown.getResponse()).toEqual({
          type: 'error',
          message: 'Custom error message',
          status: 500,
          timestamp: expect.any(Date)
        });
      }
    });
  });
});

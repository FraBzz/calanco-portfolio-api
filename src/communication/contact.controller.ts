import { Body, Inject, Post, Controller, HttpException, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContactDto } from "./dto/contact.dto";
import { ContactService } from "./contact.service";
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
    constructor(
        @Inject('IContactService')
        private contactService: ContactService
    ) { }

    @Post()
    @ApiOperation({ 
        summary: 'Submit a contact form', 
        description: 'Submits a contact form with name, email and message. An email will be sent to the site administrator.' 
    })
    @ApiBody({ 
        type: ContactDto,
        description: 'Contact form data',
        examples: {
            example1: {
                summary: 'Contact form example',
                value: {
                    name: 'Mario Rossi',
                    email: 'mario.rossi@example.com',
                    message: 'Salve, sono interessato ai vostri servizi. Potreste contattarmi per maggiori informazioni?'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Contact form submitted successfully',
        schema: {
            type: 'object',
            properties: {
                type: { type: 'string', example: 'success' },
                status: { type: 'number', example: 201 },
                message: { type: 'string', example: 'Contact form submitted successfully' },
                data: { type: 'object', example: { sent: true } },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Invalid input data',
        schema: {
            type: 'object',
            properties: {
                type: { type: 'string', example: 'error' },
                status: { type: 'number', example: 400 },
                message: { type: 'string', example: 'Validation failed' },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Internal server error - failed to send email',
        schema: {
            type: 'object',
            properties: {
                type: { type: 'string', example: 'error' },
                status: { type: 'number', example: 500 },
                message: { type: 'string', example: 'Failed to send contact email' },
                timestamp: { type: 'string', format: 'date-time' }
            }
        }
    })
    async submitContact(@Body() dto: ContactDto): Promise<ApiResponseDto<{ sent: boolean }>> {
        try {
            await this.contactService.handleContact(dto);
            return {
                type: 'success',
                status: 201,
                message: 'Contact form submitted successfully',
                data: { sent: true },
                timestamp: new Date()
            };
        } catch (error) {
            throw new HttpException({
                type: 'error',
                message: error.message || 'Failed to send contact email',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp: new Date()
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
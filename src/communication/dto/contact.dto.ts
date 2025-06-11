import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({
    description: 'Name of the person contacting',
    example: 'Mario Rossi',
    maxLength: 100
  })
  @IsNotEmpty({ message: 'Il nome è obbligatorio.' })
  @IsString()
  @MaxLength(100, { message: 'Il nome non può superare i 100 caratteri.' })
  name: string;

  @ApiProperty({
    description: 'Email address of the person contacting',
    example: 'mario.rossi@example.com',
    format: 'email'
  })
  @IsNotEmpty({ message: 'L\'email è obbligatoria.' })
  @IsEmail({}, { message: 'Email non valida.' })
  email: string;

  @ApiProperty({
    description: 'Message content from the contact form',
    example: 'Salve, sono interessato ai vostri servizi. Potreste contattarmi per maggiori informazioni?',
    maxLength: 1000
  })
  @IsNotEmpty({ message: 'Il messaggio è obbligatorio.' })
  @IsString()
  @MaxLength(1000, { message: 'Il messaggio non può superare i 1000 caratteri.' })
  message: string;
}

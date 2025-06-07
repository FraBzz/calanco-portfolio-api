import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class AddItemDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Product ID to add to cart (UUID)' })
    @IsString()
    @IsUUID()
    productId: string;

    @ApiProperty({ example: 1, description: 'Quantity of the product to add' })
    @IsNumber()
    @Min(1)
    quantity: number;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus } from '../entities/invoice.entity';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer name' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Customer email' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Customer phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    example: '123 Main St, City, State',
    description: 'Customer address',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiProperty({ example: 500.0, description: 'Invoice amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2023-09-25', description: 'Invoice date' })
  @IsDateString()
  invoiceDate: string;

  @ApiProperty({ example: '2023-10-10', description: 'Due date' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    example: 'Services rendered',
    description: 'Invoice description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateInvoiceDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Customer email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Customer phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    example: '123 Main St, City, State',
    description: 'Customer address',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiProperty({
    example: 500.0,
    description: 'Invoice amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    example: '2023-09-25',
    description: 'Invoice date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @ApiProperty({
    example: '2023-10-10',
    description: 'Due date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    example: 'Services rendered',
    description: 'Invoice description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: PaymentStatus,
    description: 'Payment status',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}

export class InvoiceQueryDto {
  @ApiProperty({
    example: 'John',
    description: 'Search by customer name or invoice number',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    enum: PaymentStatus,
    description: 'Filter by payment status',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 10, description: 'Items per page', required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class GeneratePaymentLinkDto {
  @ApiProperty({ example: 'uuid-of-invoice', description: 'Invoice ID' })
  @IsNotEmpty()
  @IsUUID()
  invoiceId: string;

  @ApiProperty({
    example: 7,
    description: 'Link expiry in days',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  expiryDays?: number;
}

export class PaymentCallbackDto {
  @ApiProperty({
    description: 'Razorpay payment ID',
    example: 'pay_RTh16XlHGoLePp',
  })
  @IsString()
  razorpay_payment_id: string;

  @ApiProperty({
    description: 'Razorpay payment link ID',
    example: 'plink_RTguQX7MoBEqBs',
  })
  @IsString()
  razorpay_payment_link_id: string;

  @ApiProperty({
    description: 'Payment link status',
    example: 'paid',
    enum: ['paid', 'failed', 'cancelled', 'expired'],
  })
  @IsString()
  @IsIn(['paid', 'failed', 'cancelled', 'expired'])
  razorpay_payment_link_status: string;

  @ApiProperty({
    description: 'Razorpay signature for verification',
    example: '7e2d7a1efc9f8081715745bb05920682912d57a9bc272f3fbef09026db61658a',
  })
  @IsString()
  razorpay_signature: string;
}

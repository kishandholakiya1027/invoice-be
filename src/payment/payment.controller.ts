import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { GeneratePaymentLinkDto, PaymentCallbackDto } from '../dto/payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('generate-link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate payment link for invoice' })
  @ApiResponse({
    status: 201,
    description: 'Payment link generated successfully',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generatePaymentLink(
    @Body() generatePaymentLinkDto: GeneratePaymentLinkDto,
    @Request() req,
  ) {
    return this.paymentService.generatePaymentLink(
      generatePaymentLinkDto,
      req.user.userId,
    );
  }

  @Post('callback')
  @ApiOperation({ summary: 'Handle Razorpay payment redirect' })
  @ApiResponse({
    status: 200,
    description: 'Payment callback processed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid signature or bad request' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async handlePaymentRedirect(@Body() body: PaymentCallbackDto) {
    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_status,
      razorpay_signature,
    } = body;

    return this.paymentService.handlePaymentCallback(
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_status,
      razorpay_signature,
    );
  }
}

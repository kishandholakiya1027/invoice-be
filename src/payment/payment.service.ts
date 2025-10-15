import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Razorpay from 'razorpay';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { razorpayConfig } from '../config/razorpay.config';
import { GeneratePaymentLinkDto } from '../dto/payment.dto';
import { Invoice, PaymentStatus } from '../entities/invoice.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {
    if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
      this.logger.warn('Razorpay credentials missing; payments disabled.');
      throw new InternalServerErrorException(
        'Razorpay credentials missing; service not initialized',
      );
    }

    this.razorpay = new Razorpay({
      key_id: razorpayConfig.keyId,
      key_secret: razorpayConfig.keySecret,
    });

    this.logger.log('Razorpay initialized.');
  }

  async generatePaymentLink(
    dto: GeneratePaymentLinkDto,
    userId: string,
    callbackUrl?: string,
  ) {
    const { invoiceId, expiryDays = 7 } = dto;

    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId, createdBy: { id: userId } },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    if (invoice.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    if (!invoice.amount || invoice.amount <= 0) {
      throw new BadRequestException('Invalid invoice amount');
    }

    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    const expireBy = Math.floor(expiresAt.getTime() / 1000);

    const payload = {
      amount: Math.round(invoice.amount * 100),
      currency: 'INR',
      accept_partial: false,
      description: `Payment for Invoice ${invoice.invoiceNumber}`,
      customer: {
        name: invoice.customerName,
        email: invoice.customerEmail,
        contact: invoice.customerPhone || undefined,
      },
      notify: {
        sms: !!invoice.customerPhone,
        email: !!invoice.customerEmail,
      },
      reminder_enable: true,
      notes: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
      callback_url: callbackUrl || process.env.RAZORPAY_CALLBACK_URL,
      callback_method: 'get',
      expire_by: expireBy,
    };

    try {
      const paymentLink = await this.razorpay.paymentLink.create(payload);

      invoice.razorpayPaymentLinkId = paymentLink.id;
      invoice.paymentLink = paymentLink.short_url;
      invoice.linkExpiresAt = expiresAt;
      invoice.paymentStatus =
        paymentLink.status === 'paid'
          ? PaymentStatus.PAID
          : PaymentStatus.PENDING;

      await this.invoiceRepository.save(invoice);

      return {
        paymentLink: paymentLink.short_url,
        paymentLinkId: paymentLink.id,
        status: paymentLink.status,
        expiresAt: invoice.linkExpiresAt,
        amount: invoice.amount,
        currency: paymentLink.currency || 'INR',
      };
    } catch (err: any) {
      this.logger.error('Failed to create Razorpay payment link', err);
      const razorErr = err?.error || err?.response?.data || err;
      const message =
        razorErr?.description ||
        razorErr?.reason ||
        razorErr?.message ||
        'Failed to create payment link';
      throw new BadRequestException(`Razorpay error: ${message}`);
    }
  }

  async handlePaymentCallback(
    paymentId: string,
    paymentLinkId: string,
    status: string,
    signature: string,
  ) {
    const invoice = await this.invoiceRepository.findOne({
      where: { razorpayPaymentLinkId: paymentLinkId },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    switch (status) {
      case 'paid':
        invoice.paymentStatus = PaymentStatus.PAID;
        invoice.razorpayPaymentId = paymentId;
        invoice.paidAt = new Date();
        break;
      case 'failed':
        invoice.paymentStatus = PaymentStatus.CANCELLED;
        break;
      case 'cancelled':
      case 'expired':
        invoice.paymentStatus = PaymentStatus.EXPIRED;
        break;
      default:
        this.logger.warn(`Unknown payment status received: ${status}`);
    }

    await this.invoiceRepository.save(invoice);
    return `Payment ${status} for invoice ${invoice.invoiceNumber}`;
  }
}

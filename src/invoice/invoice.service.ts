import Razorpay from 'razorpay';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../entities/invoice.entity';
import { razorpayConfig } from '../config/razorpay.config';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateInvoiceDto,
  InvoiceQueryDto,
  UpdateInvoiceDto,
} from '../dto/invoice.dto';

@Injectable()
export class InvoiceService {
  private razorpay: Razorpay | null;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
      this.razorpay = null;
    } else {
      try {
        this.razorpay = new Razorpay({
          key_id: razorpayConfig.keyId,
          key_secret: razorpayConfig.keySecret,
        });
      } catch (initError) {
        this.razorpay = null;
      }
    }
  }

  async create(
    createInvoiceDto: CreateInvoiceDto,
    userId: string,
  ): Promise<Invoice> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoiceNumber,
      invoiceDate: new Date(createInvoiceDto.invoiceDate),
      dueDate: new Date(createInvoiceDto.dueDate),
      createdBy: user,
    });

    return this.invoiceRepository.save(invoice);
  }

  async findAll(queryDto: InvoiceQueryDto, userId: string) {
    const { search, status, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const baseCondition = { createdBy: { id: userId } };
    let where: any = [baseCondition];

    if (search) {
      const searchFilter = [
        { ...baseCondition, customerName: ILike(`%${search}%`) },
        { ...baseCondition, invoiceNumber: ILike(`%${search}%`) },
      ];
      where = searchFilter;
    }

    if (status) {
      where.paymentStatus = status;
    }

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['createdBy'],
    });

    return {
      invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['createdBy'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    userId: string,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, userId);

    const updateData: any = { ...updateInvoiceDto };

    if (updateInvoiceDto.invoiceDate) {
      updateData.invoiceDate = new Date(updateInvoiceDto.invoiceDate);
    }
    if (updateInvoiceDto.dueDate) {
      updateData.dueDate = new Date(updateInvoiceDto.dueDate);
    }

    Object.assign(invoice, updateData);
    return this.invoiceRepository.save(invoice);
  }

  async remove(id: string, userId: string): Promise<void> {
    const invoice = await this.findOne(id, userId);
    await this.invoiceRepository.remove(invoice);
  }
}

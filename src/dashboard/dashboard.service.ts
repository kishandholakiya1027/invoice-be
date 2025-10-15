import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice, PaymentStatus } from '../entities/invoice.entity';
import { DashboardResponseDto, DashboardStatsDto } from '../dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async getDashboardData(userId: string): Promise<DashboardResponseDto> {
    const invoices = await this.invoiceRepository.find({
      where: { createdBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    const stats = await this.calculateStats(invoices);

    return {
      stats,
    };
  }

  private async calculateStats(
    invoices: Invoice[],
  ): Promise<DashboardStatsDto> {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(
      (inv) => inv.paymentStatus === PaymentStatus.PAID,
    ).length;
    const pendingInvoices = invoices.filter(
      (inv) => inv.paymentStatus === PaymentStatus.PENDING,
    ).length;

    const uniqueCustomers = new Set(invoices.map((inv) => inv.customerEmail))
      .size;

    const totalAmount = invoices.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );
    const paidAmount = invoices
      .filter((inv) => inv.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, inv) => sum + Number(inv.amount), 0);
    const pendingAmount = invoices
      .filter((inv) => inv.paymentStatus === PaymentStatus.PENDING)
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    const paymentRate =
      totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

    const monthlyGrowth = await this.calculateMonthlyGrowth(invoices);

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalCustomers: uniqueCustomers,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paidAmount: Math.round(paidAmount * 100) / 100,
      pendingAmount: Math.round(pendingAmount * 100) / 100,
      paymentRate,
      monthlyGrowth,
    };
  }

  private async calculateMonthlyGrowth(invoices: Invoice[]): Promise<number> {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthInvoices = invoices.filter(
      (inv) => new Date(inv.createdAt) >= currentMonth,
    );

    const lastMonthInvoices = invoices.filter(
      (inv) =>
        new Date(inv.createdAt) >= lastMonth &&
        new Date(inv.createdAt) <= lastMonthEnd,
    );

    if (lastMonthInvoices.length === 0) {
      return currentMonthInvoices.length > 0 ? 100 : 0;
    }

    const growth =
      ((currentMonthInvoices.length - lastMonthInvoices.length) /
        lastMonthInvoices.length) *
      100;
    return Math.round(growth);
  }
}

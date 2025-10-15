import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total number of invoices' })
  totalInvoices: number;

  @ApiProperty({ description: 'Number of paid invoices' })
  paidInvoices: number;

  @ApiProperty({ description: 'Number of pending invoices' })
  pendingInvoices: number;

  @ApiProperty({ description: 'Number of unique customers' })
  totalCustomers: number;

  @ApiProperty({ description: 'Total amount of all invoices' })
  totalAmount: number;

  @ApiProperty({ description: 'Total amount of paid invoices' })
  paidAmount: number;

  @ApiProperty({ description: 'Total amount of pending invoices' })
  pendingAmount: number;

  @ApiProperty({ description: 'Payment rate percentage' })
  paymentRate: number;

  @ApiProperty({ description: 'Percentage change from last month' })
  monthlyGrowth: number;
}

export class RecentInvoiceDto {
  @ApiProperty({ description: 'Invoice ID' })
  id: string;

  @ApiProperty({ description: 'Invoice number' })
  invoiceNumber: string;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiProperty({ description: 'Invoice amount' })
  amount: number;

  @ApiProperty({ description: 'Payment status' })
  paymentStatus: string;

  @ApiProperty({ description: 'Invoice date' })
  invoiceDate: Date;

  @ApiProperty({ description: 'Due date' })
  dueDate: Date;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Dashboard statistics', type: DashboardStatsDto })
  stats: DashboardStatsDto;
}

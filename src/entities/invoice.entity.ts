import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column({ type: 'text', nullable: true })
  customerAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  paymentLink: string;

  @Column({ nullable: true })
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ nullable: true })
  razorpayPaymentLinkId?: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  linkExpiresAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

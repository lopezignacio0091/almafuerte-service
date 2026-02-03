import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      order: { paymentDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByMemberId(memberId: string): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      where: { memberId },
      order: { paymentDate: 'DESC' },
    });
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentEntity> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async getPaymentStats(memberId: string): Promise<{
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalAmount: number;
    paidAmount: number;
  }> {
    const payments = await this.paymentRepository.find({
      where: { memberId },
    });

    const totalAmount = payments.reduce(
      (sum, p) => sum + parseFloat(p.amount.toString()),
      0,
    );
    const paidAmount = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

    return {
      total: payments.length,
      paid: payments.filter((p) => p.status === 'paid').length,
      pending: payments.filter((p) => p.status === 'pending').length,
      overdue: payments.filter((p) => p.status === 'overdue').length,
      totalAmount: Number(totalAmount.toFixed(2)),
      paidAmount: Number(paidAmount.toFixed(2)),
    };
  }

  async findByStatus(
    status: 'pending' | 'paid' | 'overdue',
  ): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      where: { status },
      order: { paymentDate: 'DESC' },
    });
  }

  async findOverduePayments(): Promise<PaymentEntity[]> {
    const today = new Date();
    const payments = await this.paymentRepository.find();

    return payments.filter(
      (payment) => payment.paymentDate < today && payment.status !== 'paid',
    );
  }
}

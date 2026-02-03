import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: 'pending' | 'paid' | 'overdue') {
    return this.paymentsService.findByStatus(status);
  }

  @Get('overdue')
  findOverduePayments() {
    return this.paymentsService.findOverduePayments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Get('member/:memberId')
  findByMemberId(@Param('memberId') memberId: string) {
    return this.paymentsService.findByMemberId(memberId);
  }

  @Get('member/:memberId/stats')
  getPaymentStats(@Param('memberId') memberId: string) {
    return this.paymentsService.getPaymentStats(memberId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}

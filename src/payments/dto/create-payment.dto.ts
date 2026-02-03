import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  paymentDate: string;

  @IsEnum(['pending', 'paid', 'overdue'])
  status: 'pending' | 'paid' | 'overdue';

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  memberId: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'overdue'])
  status?: 'pending' | 'paid' | 'overdue';

  @IsOptional()
  @IsString()
  description?: string;
}

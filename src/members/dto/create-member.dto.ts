import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMemberDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  phone: string;

  @IsDateString()
  @Transform(({ value }) => value?.trim())
  joinDate: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value?.trim())
  exitDate?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

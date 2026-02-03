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
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get('active')
  findActive() {
    return this.membersService.findActive();
  }

  @Get(':id')
  findOne(id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  update(id: string, updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Patch(':id/deactivate')
  deactivate(id: string) {
    return this.membersService.deactivate(id);
  }

  @Patch(':id/activate')
  activate(id: string) {
    return this.membersService.activate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(id: string) {
    return this.membersService.remove(id);
  }
}
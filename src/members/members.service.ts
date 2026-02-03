import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<MemberEntity> {
    const member = this.memberRepository.create(createMemberDto);
    return this.memberRepository.save(member);
  }

  async findAll(): Promise<MemberEntity[]> {
    return this.memberRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<MemberEntity[]> {
    return this.memberRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MemberEntity> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async update(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberEntity> {
    const member = await this.findOne(id);
    Object.assign(member, updateMemberDto);
    return this.memberRepository.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    await this.memberRepository.remove(member);
  }

  async deactivate(id: string): Promise<MemberEntity> {
    const member = await this.findOne(id);
    member.isActive = false;
    member.exitDate = new Date();
    return this.memberRepository.save(member);
  }

  async activate(id: string): Promise<MemberEntity> {
    const member = await this.findOne(id);
    member.isActive = true;
    member.exitDate = null;
    return this.memberRepository.save(member);
  }
}

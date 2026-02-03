import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password', 'role', 'isActive'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAllActive(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      order: { username: 'ASC' },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { username: 'ASC' },
    });
  }

  async search(query: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :query', { query: `%${query}%` })
      .orWhere('user.email ILIKE :query', { query: `%${query}%` })
      .orderBy('user.username', 'ASC')
      .getMany();
  }

  async emailExists(email: string): Promise<boolean> {
    return (await this.userRepository.count({ where: { email } })) > 0;
  }

  async usernameExists(username: string): Promise<boolean> {
    return (await this.userRepository.count({ where: { username } })) > 0;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    if (userData.email && (await this.emailExists(userData.email))) {
      throw new ConflictException(
        `El email ${userData.email} ya está registrado`,
      );
    }

    if (userData.username && (await this.usernameExists(userData.username))) {
      throw new ConflictException(`El usuario ${userData.username} ya existe`);
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateUser(
    id: number,
    updateData: Partial<User>,
  ): Promise<User | null> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async deletePermanent(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async activate(id: number): Promise<void> {
    await this.userRepository.update(id, { isActive: true });
  }
}

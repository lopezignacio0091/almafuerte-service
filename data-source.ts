import { DataSource } from 'typeorm';
import { MemberEntity } from './src/members/entities/member.entity';
import { PaymentEntity } from './src/payments/entities/payment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'almafuerte',
  entities: [MemberEntity, PaymentEntity],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrations: ['database/migrations/*.ts'],
});

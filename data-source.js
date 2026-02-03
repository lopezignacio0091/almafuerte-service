const { DataSource } = require('typeorm');
const { MemberEntity } = require('./dist/src/members/entities/member.entity');
const { PaymentEntity } = require('./dist/src/payments/entities/payment.entity');

module.exports = {
  AppDataSource: new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'db.rooohiudzowrvplqbkhj.supabase.co',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'almafuerte',
    entities: [MemberEntity, PaymentEntity],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrations: ['dist/database/migrations/*.js'],
  }),
};

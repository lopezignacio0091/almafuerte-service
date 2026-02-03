import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddYearToMembers1704067500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" ADD COLUMN "year" integer NOT NULL DEFAULT 2024`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "year"`);
  }
}

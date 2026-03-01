import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneNumberToOrderTable1772351444814 implements MigrationInterface {
  name = 'AddPhoneNumberToOrderTable1772351444814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "phoneNumber" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "phoneNumber"`);
  }
}

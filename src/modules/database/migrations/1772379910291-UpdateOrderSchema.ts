import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderSchema1772379910291 implements MigrationInterface {
  name = 'UpdateOrderSchema1772379910291';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "orderCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "UQ_a97c808a83af1497276bf85e5ba" UNIQUE ("orderCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "UQ_a97c808a83af1497276bf85e5ba"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderCode"`);
  }
}

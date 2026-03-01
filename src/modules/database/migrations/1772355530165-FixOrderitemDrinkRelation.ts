import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixOrderitemDrinkRelation1772355530165 implements MigrationInterface {
  name = 'FixOrderitemDrinkRelation1772355530165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_75d1b6b7c9e83cccaa9b6d4b09a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "UQ_75d1b6b7c9e83cccaa9b6d4b09a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_75d1b6b7c9e83cccaa9b6d4b09a" FOREIGN KEY ("drinkId") REFERENCES "drinks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_75d1b6b7c9e83cccaa9b6d4b09a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "UQ_75d1b6b7c9e83cccaa9b6d4b09a" UNIQUE ("drinkId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_75d1b6b7c9e83cccaa9b6d4b09a" FOREIGN KEY ("drinkId") REFERENCES "drinks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

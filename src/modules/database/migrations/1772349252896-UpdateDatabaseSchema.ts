import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabaseSchema1772349252896 implements MigrationInterface {
  name = 'UpdateDatabaseSchema1772349252896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drinks" DROP CONSTRAINT "FK_2a7369405084762773d640111e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "drinks" RENAME COLUMN "category_id" TO "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "drinkItemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "drinkName"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "toppings"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "customerUsername"`,
    );
    await queryRunner.query(`ALTER TABLE "toppings" ADD "orderItemId" uuid`);
    await queryRunner.query(`ALTER TABLE "order_items" ADD "drinkId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "UQ_75d1b6b7c9e83cccaa9b6d4b09a" UNIQUE ("drinkId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "drinks" ADD CONSTRAINT "FK_2a77487278a831eb80db57af4ed" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toppings" ADD CONSTRAINT "FK_9d0c1e5de8954e1c9513accc6a8" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "toppings" DROP CONSTRAINT "FK_9d0c1e5de8954e1c9513accc6a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "drinks" DROP CONSTRAINT "FK_2a77487278a831eb80db57af4ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "UQ_75d1b6b7c9e83cccaa9b6d4b09a"`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "drinkId"`);
    await queryRunner.query(`ALTER TABLE "toppings" DROP COLUMN "orderItemId"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "customerUsername" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" ADD "toppings" json`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "drinkName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "drinkItemId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "drinks" RENAME COLUMN "categoryId" TO "category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "drinks" ADD CONSTRAINT "FK_2a7369405084762773d640111e0" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

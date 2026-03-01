import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabaseSchema1772349847359 implements MigrationInterface {
  name = 'UpdateDatabaseSchema1772349847359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "toppings" DROP CONSTRAINT "FK_9d0c1e5de8954e1c9513accc6a8"`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item_toppings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderItemId" uuid, "toppingId" uuid, CONSTRAINT "PK_6ca3b53c7387ef22bdd26d31be2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "toppings" DROP COLUMN "orderItemId"`);
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" ADD CONSTRAINT "FK_1a74ccebef16dd8afba0527edee" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" ADD CONSTRAINT "FK_a10302aa366869faacb0ad637cc" FOREIGN KEY ("toppingId") REFERENCES "toppings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" DROP CONSTRAINT "FK_a10302aa366869faacb0ad637cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_toppings" DROP CONSTRAINT "FK_1a74ccebef16dd8afba0527edee"`,
    );
    await queryRunner.query(`ALTER TABLE "toppings" ADD "orderItemId" uuid`);
    await queryRunner.query(`DROP TABLE "order_item_toppings"`);
    await queryRunner.query(
      `ALTER TABLE "toppings" ADD CONSTRAINT "FK_9d0c1e5de8954e1c9513accc6a8" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabaseSchema1772341470804 implements MigrationInterface {
  name = 'CreateDatabaseSchema1772341470804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_items_size_enum" AS ENUM('M', 'L')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "drinkItemId" character varying NOT NULL, "drinkName" character varying NOT NULL, "size" "public"."order_items_size_enum" NOT NULL, "basePrice" double precision NOT NULL, "toppings" json, "quantity" integer NOT NULL, "totalPrice" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "order_id" uuid, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'DONE', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerTelegramId" character varying NOT NULL, "customerName" character varying NOT NULL, "customerUsername" character varying, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING', "totalPrice" double precision NOT NULL, "deliveryAddress" text, "note" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "toppings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "price" double precision NOT NULL, "available" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d2aeeaa65d348c30a84739d388c" UNIQUE ("itemId"), CONSTRAINT "PK_6a1c9185d307454dfadc29f3019" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "drinks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "priceM" double precision NOT NULL, "priceL" double precision NOT NULL, "available" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid, CONSTRAINT "UQ_ac7fb932530df837d37d1e35083" UNIQUE ("itemId"), CONSTRAINT "PK_c729b137d69b681e87798293e3f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "drinks" ADD CONSTRAINT "FK_2a7369405084762773d640111e0" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drinks" DROP CONSTRAINT "FK_2a7369405084762773d640111e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
    );
    await queryRunner.query(`DROP TABLE "drinks"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "toppings"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TYPE "public"."order_items_size_enum"`);
  }
}

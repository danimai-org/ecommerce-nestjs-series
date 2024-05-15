import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1715008820370 implements MigrationInterface {
  name = 'Migrations1715008820370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "email_verified_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "phone_number" character varying(13) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "UQ_46c5f573cb24bdc6e81b8ef2504" UNIQUE ("phone_number")`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "country_code" character varying(3) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "country_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "UQ_46c5f573cb24bdc6e81b8ef2504"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "phone_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email_verified_at" TIMESTAMP WITH TIME ZONE`,
    );
  }
}

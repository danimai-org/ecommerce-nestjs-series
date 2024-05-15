import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1715775900515 implements MigrationInterface {
    name = 'Migrations1715775900515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant_media" ALTER COLUMN "rank" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "metadata" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "rank" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "rank" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "metadata" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_variant_media" ALTER COLUMN "rank" DROP DEFAULT`);
    }

}

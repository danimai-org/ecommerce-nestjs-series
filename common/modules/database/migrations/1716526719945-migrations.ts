import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1716526719945 implements MigrationInterface {
    name = 'Migrations1716526719945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(200) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying(50) NOT NULL`);
    }

}

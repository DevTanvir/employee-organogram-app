import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployees1731169318411 implements MigrationInterface {
    name = 'CreateEmployees1731169318411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employees" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "positionId" integer NOT NULL, "positionName" character varying NOT NULL, "mpath" character varying DEFAULT '', "supervisorId" integer, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_cf65986a1aca4c9da695923dc02" FOREIGN KEY ("supervisorId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_cf65986a1aca4c9da695923dc02"`);
        await queryRunner.query(`DROP TABLE "employees"`);
    }

}

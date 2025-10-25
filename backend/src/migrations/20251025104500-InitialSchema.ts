import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema20251025104500 implements MigrationInterface {
  name = 'InitialSchema20251025104500'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "boards" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "columns" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "boardId" uuid NOT NULL,
      CONSTRAINT "FK_columns_board" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_columns_board" ON "columns" ("boardId")`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "tasks" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "title" text NOT NULL,
      "description" text,
      "columnId" uuid NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now(),
      "deleted_at" timestamptz,
      CONSTRAINT "FK_tasks_column" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tasks_column" ON "tasks" ("columnId")`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "task_logs" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "task_id" uuid NOT NULL,
      "board_id" uuid,
      "from_column_id" uuid,
      "to_column_id" uuid,
      "action" text NOT NULL,
      "payload" jsonb,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "FK_task_logs_task" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_task_logs_board" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE SET NULL,
      CONSTRAINT "FK_task_logs_from_col" FOREIGN KEY ("from_column_id") REFERENCES "columns"("id") ON DELETE SET NULL,
      CONSTRAINT "FK_task_logs_to_col" FOREIGN KEY ("to_column_id") REFERENCES "columns"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_task_logs_task_created" ON "task_logs" ("task_id", "created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_task_logs_task_created"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_logs"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_column"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_columns_board"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "columns"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "boards"`);
  }
}

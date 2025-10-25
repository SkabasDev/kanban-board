import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'kanban',
  entities: [
    // Use compiled JS when running migrations via ts-node helper it can read TS
    'src/modules/**/**.entity{.ts,.js}'
  ],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
})

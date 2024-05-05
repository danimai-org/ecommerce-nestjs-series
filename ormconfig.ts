import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const configs: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [path.join(__dirname, '/common/entities/**/*.entity.{ts,js}')],
  migrations: [
    path.join(__dirname, '/common/modules/database/migrations/*{.ts,.js}'),
  ],
  dropSchema: false,
  logging: false,
} as any;
const dataSource = new DataSource(configs);

export default dataSource;

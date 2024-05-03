import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const configs: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/modules/database/migrations/*{.ts,.js}'],
  dropSchema: false,
  logging: false,
};
const dataSource = new DataSource(configs);

export default dataSource;
